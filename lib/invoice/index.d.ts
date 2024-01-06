/// <reference types="node" />
import createQr from "../qr";
import EventEmitter from "events";
declare enum InvoiceStatus {
    WAITING = "waiting",
    PAID = "paid"
}
export default class InvoiceBuilder extends EventEmitter {
    private useRaw;
    private liveUpdate;
    private rpc;
    private ws?;
    private invoiceMap;
    maxHistory: string;
    constructor(options: {
        useRaw: boolean;
        liveUpdate: boolean;
        rpcEndpoint: string;
        wsEndpoint?: string;
        customHeaders: Record<any, any>;
        maxHistory: string;
    });
    create(invoiceData: {
        recipientAddress: string;
        amountNano: number;
        label?: string;
        message?: string;
        roundingPercent: number;
    }): Promise<string>;
    get(id: string): {
        id: string;
        data: any;
    };
    private attachWsListeners;
    checkStatus(id: string): Promise<any | null>;
    remove(invoiceId: string): void;
}
export { createQr, InvoiceStatus };
