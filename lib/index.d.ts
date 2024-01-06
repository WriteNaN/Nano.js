/// <reference types="node" />
import RPC from "./rpc";
import WebSocket from "./ws";
import { IAccount } from "./db";
import EventEmitter from "events";
import { nanoToRaw, rawToNano } from "./utils/convert";
import InvoiceBuilder, { createQr, InvoiceStatus } from "./invoice";
declare class Wallet extends EventEmitter {
    ws: WebSocket;
    rpc: RPC;
    private storage;
    masterSeed: string;
    autoReceive: boolean;
    Block: any;
    private deriveAccount;
    private walletAccounts;
    constructor(masterSeed: string, { WS_URL, RPC_URL, WORK_SERVER, Headers, autoReceive }: {
        WS_URL: string;
        RPC_URL: string;
        WORK_SERVER?: string;
        Headers?: Record<string, any>;
        autoReceive?: boolean;
    });
    attachWsListener(): Promise<void>;
    getAllAccounts(): IAccount[];
    initialize(): Promise<boolean>;
    _loadWallet(): Promise<void>;
    _searchAndLoadWallets(start: number, end: number): Promise<void>;
    private isInitialized;
    private setInitialized;
    resetWallet(): Promise<void>;
    addAccount(index: number): any;
    send({ recipient, amount, from, isRaw }: {
        recipient: string;
        amount: number;
        from: number;
        isRaw?: boolean;
    }): Promise<any>;
    setRepresentative({ newRepresentative, accountIndex }: {
        newRepresentative: string;
        accountIndex: number;
    }): Promise<any>;
    removeAccount(index: number): void;
    getAccount(index: number): any;
}
export { Wallet, nanoToRaw, rawToNano, InvoiceBuilder, InvoiceStatus, createQr, RPC, WebSocket };
