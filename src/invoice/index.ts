import createQr from "../qr";
import WebSocket from "../ws";
import { nanoToRaw, rawToNano } from "../utils/convert";
import RPC from "../rpc";
import EventEmitter from "events";
import { v4 as uuidv4 } from "uuid";
import Decimal from "decimal.js";

enum InvoiceStatus {
  WAITING = 'waiting',
  PAID = 'paid',
}

export default class InvoiceBuilder extends EventEmitter {
  private useRaw: boolean;
  private liveUpdate: boolean;
  private rpc: RPC;
  private ws?: WebSocket | undefined;
  private invoiceMap: Map<string, any>;
  maxHistory: string;

  constructor(options: { useRaw: boolean, liveUpdate: boolean, rpcEndpoint: string, wsEndpoint?: string, customHeaders: Record<any, any>, maxHistory: string }) {
    super();
    const { useRaw, liveUpdate, rpcEndpoint, wsEndpoint, customHeaders } = options;
    this.useRaw = useRaw;
    this.liveUpdate = liveUpdate;
    this.rpc = new RPC(rpcEndpoint, customHeaders);
    this.ws = wsEndpoint ? new WebSocket(wsEndpoint) : undefined;
    this.invoiceMap = new Map();
    this.maxHistory = options.maxHistory || "50";

    if (this.liveUpdate && this.ws) {
      this.attachWsListeners();
    }
  }

  public async create(invoiceData: { recipientAddress: string, amountNano: number, label?: string, message?: string, roundingPercent: number }): Promise<string> {
    const { recipientAddress, amountNano, label, message, roundingPercent } = invoiceData;

    if (!recipientAddress || !amountNano || roundingPercent < 0) {
      throw new Error('Invalid input data for invoice creation.');
    }

    const amountRaw = this.useRaw ? amountNano.toString() : nanoToRaw(amountNano);

    // Check for duplicates
    const existingInvoice = Array.from(this.invoiceMap.values())
      .find(invoice => invoice.address === recipientAddress && invoice.amount === amountRaw);

    if (existingInvoice) {
      // Handle duplicate (reject or update existing invoice)
      throw new Error('Invoice with the same recipient address and amount already exists.');
    }

    const qrResult = await createQr({
      address: recipientAddress,
      // @ts-ignore
      amount: amountRaw,
      label,
      message,
      isRaw: true
    });

    const invoiceId = uuidv4();

    const newInvoice = {
      uri: qrResult.uri,
      qrCode: qrResult.qrCode,
      address: recipientAddress,
      amount: amountRaw,
      label,
      message,
      roundingPercent,
      status: InvoiceStatus.WAITING,
      invoiceId,
    };

    this.invoiceMap.set(invoiceId, newInvoice);

    return invoiceId;
  }

  get(id: string) {
    return {
      id: id,
      data: this.invoiceMap.get(id)
    };
  }

  private async attachWsListeners(): Promise<void> {
    if (!this.ws) return;

    this.ws.send({
      "action": "subscribe",
      "topic": "confirmation",
    });

    this.ws.on("message", async (message: any) => {
      if (message.topic !== "confirmation" || message.message.block.subtype !== "send") return;

      const invoices = Array.from(this.invoiceMap.values());
      const link = message.message.block.link_as_account;
      const matchingInvoice = invoices.find(invoice => invoice.address === link);

      if (!matchingInvoice) return;

      const amountIn = parseFloat(rawToNano(matchingInvoice.amount));
      const amount = parseFloat(rawToNano(message.message.amount));
      const isAmountWithinRounding = Math.abs(amountIn - amount) <= (matchingInvoice.roundingPercent / 100) * Math.abs(amountIn);

      if (isAmountWithinRounding) {
        if (matchingInvoice.status === InvoiceStatus.PAID) return this.emit("error", { error: "Invoice already paid", invoice: matchingInvoice.invoiceId });
        this.invoiceMap.set(matchingInvoice.invoiceId, { ...matchingInvoice, status: InvoiceStatus.PAID });
        this.emit('payment', this.get(matchingInvoice.invoiceId));
      } else {
        this.emit("error", { expectedAmount: amountIn, receivedAmount: amount, invoiceId: matchingInvoice.invoiceId, error: "Amount not within rounding" });
      }
    });
  }

  async checkStatus(id: string): Promise<any | null> {
    const invoice = this.invoiceMap.get(id);

    if (!invoice || invoice.status === InvoiceStatus.PAID) {
      return invoice ? invoice.status : null;
    }

    const { amount, roundingPercent } = invoice;
    const amountIn = new Decimal(rawToNano(amount));

    const rpcResponse = await this.rpc.getAccountHistory(invoice.address);

    if (!rpcResponse || rpcResponse.length === 0) {
      return InvoiceStatus.WAITING;
    }

    const isAmountWithinRounding = (amount: Decimal) =>
      amountIn.minus(amount).abs().lte(amountIn.times(roundingPercent / 100));

    for (const transaction of rpcResponse) {
      const receivedAmount = new Decimal(rawToNano(transaction.amount));

      if (isAmountWithinRounding(receivedAmount)) {
        this.invoiceMap.set(id, { ...invoice, status: InvoiceStatus.PAID });
        return this.get(invoice.invoiceId);
      }
    }

    return InvoiceStatus.WAITING;
  }

  remove(invoiceId: string) {
    this.invoiceMap.delete(invoiceId);
  }
}

export { createQr, InvoiceStatus };
