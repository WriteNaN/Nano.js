/**

* credits to my bro [Benskalz](https://github.com/Benskalz/simple-nano-wallet-js/blob/main/wallet/wallet.js) to help me with this <3

*/
export default class Block {
    rpc: any;
    amount?: number;
    constructor(rpc: any);
    send(toAddress: string, amount: number, privateKey: string, isRaw?: boolean): Promise<any>;
    representative(repAddress: string, privateKey: string): Promise<any>;
    receive(pendingTx: {
        hash: string;
        amount: string;
    }, privateKey: string, openRep?: string): Promise<any>;
    receiveAll(privateKey: string): Promise<any[]>;
}
