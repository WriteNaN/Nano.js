/** 

* credits to my bro [Benskalz](https://github.com/Benskalz/simple-nano-wallet-js/blob/main/wallet/wallet.js) to help me with this <3

*/

import { block } from "multi-nano-web";
import nanocurrency from "nanocurrency";
import { nanoToRaw, rawToNano } from "../convert";

export default class Block {
  rpc: any;
  amount?: number;

  constructor(rpc: any) {
    this.rpc = rpc;
  }

  async send(toAddress: string, amount: number, privateKey: string, isRaw: boolean = false) {
    if (isRaw) {
      this.amount = amount;
      const publicKey = nanocurrency.derivePublicKey(privateKey);
      const address = nanocurrency.deriveAddress(publicKey, {useNanoPrefix: true});

      const account_info = await this.rpc.account_info(address);

      if (account_info.error) throw new Error("Error from RPC", account_info.error);

      const data = {
        walletBalanceRaw: account_info.balance,
        fromAddress: address,
        toAddress,
        representativeAddress: account_info.representative,
        amountRaw: this.amount.toString(),
        frontier: account_info.frontier,
        work: await this.rpc.work_generate(account_info.frontier),
      }

      const signedBlock = block.send(data, privateKey);

      return await this.rpc.process(signedBlock);
      
    } else {
      this.amount = parseInt(nanoToRaw(amount));
      const publicKey = nanocurrency.derivePublicKey(privateKey);
      const address = nanocurrency.deriveAddress(publicKey, {useNanoPrefix: true});

      const account_info = await this.rpc.account_info(address);

      if (account_info.error) throw new Error("Error from RPC", account_info.error);

      const data = {
        walletBalanceRaw: account_info.balance,
        fromAddress: address,
        toAddress,
        representativeAddress: account_info.representative,
        amountRaw: this.amount.toString(),
        frontier: account_info.frontier,
        work: await this.rpc.work_generate(account_info.frontier),
      }

      const signedBlock = block.send(data, privateKey);

      return await this.rpc.process(signedBlock);
      
    }
  }

  async representative(repAddress: string, privateKey: string) {
    const publicKey = nanocurrency.derivePublicKey(privateKey);
    const address = nanocurrency.deriveAddress(publicKey, {useNanoPrefix: true});

    const account_info = await this.rpc.account_info(address);

    if (account_info.error === "Account not found") throw new Error("Account has to be opened before changing representative!");

    const toSign = {
      walletBalanceRaw: account_info.balance,
      representativeAddress: repAddress,
      address,
      frontier: account_info.frontier,
      work: await this.rpc.work_generate(account_info.frontier)
    }

    const signedBlock = block.representative(toSign, privateKey);

    return await this.rpc.process(signedBlock);
  }

  async receive(pendingTx: { hash: string; amount: string }, privateKey: string, openRep = "nano_1gmor8qytb6os131yriu3xwt6a8wukaos3eg9yfno1x5kpm6uwgowqix89cq"): Promise<any> {
    
    const publicKey = nanocurrency.derivePublicKey(privateKey);
    const address = nanocurrency.deriveAddress(publicKey, {useNanoPrefix: true});

    const account_info = await this.rpc.account_info(address);


    let data: {
      toAddress: string;
      transactionHash: string;
      amountRaw: string;
      walletBalanceRaw: string;
      representativeAddress: string;
      frontier: string;
      work?: string;
    } = {
      toAddress: address,
      transactionHash: pendingTx.hash,
      amountRaw: pendingTx.amount.toString(),
      walletBalanceRaw: "0",
      frontier: "0",
      representativeAddress: openRep,
    };

    if (account_info.error === "Account not found") {
      //console.log("proceeding to open acc");
      data.walletBalanceRaw = "0";
      data.representativeAddress = openRep;
      data.frontier = "0".repeat(64);
      data.work = await this.rpc.work_generate(publicKey);
    } else {
      data.walletBalanceRaw = account_info.balance;
      data.representativeAddress = account_info.representative;
      data.frontier = account_info.frontier;
      data.work = await this.rpc.work_generate(account_info.frontier);
    }

    const signedBlock = block.receive(data, privateKey);
    let r = await this.rpc.process(signedBlock, "receive");
    return r;
  }

  async receiveAll(privateKey: string) {
    const publicKey = nanocurrency.derivePublicKey(privateKey);
    const address = nanocurrency.deriveAddress(publicKey, {useNanoPrefix: true});

    const done: any[] = [];

    while (true) {
      const receivable = await this.rpc.receivable(address);
      if (Object.keys(receivable).length === 0) break;

      const transaction = {
        hash: Object.keys(receivable)[0],
        amount: receivable[Object.keys(receivable)[0]]
      };

      try {
        const result = await this.receive(transaction, privateKey);
        done.push(result);
      } catch (error) {
        throw error;
      }
    }

    return done;
  }
}
