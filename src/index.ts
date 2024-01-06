require('@babel/register')({
  extensions: ['.js', '.ts'],
});


import RPC from "./rpc";
import WebSocket from "./ws";
import WalletStorage, { Account, IAccount } from "./db";
import EventEmitter from "events";
import { Block, deriveAccount } from "./utils/nanocurrency/index";
import { nanoToRaw, rawToNano } from "./utils/convert";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from 'url';
import crypto from "crypto";
import InvoiceBuilder, { createQr, InvoiceStatus } from "./invoice";


// @ts-ignore
global.__filename = (typeof __filename !== 'undefined') ? __filename : require('url').fileURLToPath(import.meta.url);
global.__dirname = (typeof __dirname !== 'undefined') ? __dirname : path.dirname(__filename);

class Wallet extends EventEmitter {
  ws: WebSocket;
  rpc: RPC;
  private storage: WalletStorage;
  masterSeed: string;
  autoReceive: boolean;
  Block: any;
  private deriveAccount: any;
  private walletAccounts: Map<any, any>;

  constructor(masterSeed: string, { WS_URL, RPC_URL, WORK_SERVER, Headers, autoReceive = false }: {
    WS_URL: string,
    RPC_URL: string,
    WORK_SERVER?: string,
    Headers?: Record<string, any>
    autoReceive?: boolean
  }) {
    super();
    this.masterSeed = masterSeed;
    this.autoReceive = autoReceive;
    this.deriveAccount = deriveAccount;
    this.ws = new WebSocket(WS_URL);
    this.Block = () => new Block(this.rpc);
    this.rpc = new RPC(RPC_URL, Headers, WORK_SERVER);
    this.storage = new WalletStorage(this.masterSeed);
    this.walletAccounts = new Map();

    this._loadWallet();
    this.initialize();
    this.attachWsListener();
  }

  async attachWsListener() {
    if (this.autoReceive) {


      for (const [key, value] of this.walletAccounts) {
        const hashes = await this.Block().receiveAll(value.keys.privateKey);
        for (const hash of hashes) {
          this.emit("receive", hash);
        } 
      }

      this.ws.send({
        action: "subscribe",
        topic: "confirmation",
      });

      this.ws.on("message", async (message) => {
        if (message.topic === "confirmation"){
          if (message.message.block.subtype === "send") {
            if (this.walletAccounts.has(message.message.block.link_as_account)) {
              const done = await this.Block().receive({hash: message.message.hash, amount: message.message.amount}, this.walletAccounts.get(message.message.block.link_as_account).keys.privateKey);
              this.emit("receive", done);
            }
          } 
        } 
      });

    } else { return }
  }

  getAllAccounts() {
    return this.storage.getAllAccounts();
  }


  async initialize() {
    if (!(await this.isInitialized())) {
      this._searchAndLoadWallets(0, 20);
      console.log("Searching for used wallets...");
      this.setInitialized(true);
    } else {
      return this.emit("ready");
    }
  }

  async _loadWallet() {
    const accounts = this.storage.getAllAccounts();
    for (const account of accounts) {
      this.walletAccounts.set(account.address, account);
    }
    for (let i = 0; i < 1; i++) {
      const account = await this.deriveAccount(this.masterSeed, i);
      if (accounts.some(a => a.address === account.address)) return;
      this.storage.addAccount(new Account(account));
      console.log("Index Account Derived.");
    }
  }

  async _searchAndLoadWallets(start: number, end: number) {
    const accounts = this.storage.getAllAccounts();
    for (let i = start; i < end; i++) {
      const account = await this.deriveAccount(this.masterSeed, i);
      if (accounts.some(a => a.address === account.address)) continue;
      const accountHistory = await this.rpc.getAccountHistory(account.address);
      console.log(accountHistory);

      if (accountHistory.length > 0) {
        this.storage.addAccount(new Account(account));
        this.walletAccounts.set(account.address, account);
      } // else removed
    }
    this.emit("ready");
  }

  private async isInitialized(): Promise<boolean> {
    const db_init_path = crypto.scryptSync(crypto.createHash("sha256").update(this.masterSeed).digest("hex"), "salt", 16).toString("hex");
    const configPath = path.join(__dirname, `${db_init_path}.config.json`);
    try {
      const configFile = await fs.readFile(configPath, 'utf8');
      const config = JSON.parse(configFile);
      return config.isInitialized === true;
    } catch (error) {
      if (error instanceof Error && 'code' in error && (error as NodeJS.ErrnoException).code === 'ENOENT') {
        await fs.writeFile(configPath, JSON.stringify({ isInitialized: false }), 'utf8');
        return false;
      } else {
        throw error;
      }
    }
  }

  private async setInitialized(value: boolean): Promise<void> {
    const db_init_path = crypto.scryptSync(crypto.createHash("sha256").update(this.masterSeed).digest("hex"), "salt", 16).toString("hex");
    const configPath = path.join(__dirname, `${db_init_path}.config.json`);
    const config = { isInitialized: value };
    await fs.writeFile(configPath, JSON.stringify(config), 'utf8');
  }

  async resetWallet() {
    try {
      this.storage.resetWallet();
      this.setInitialized(false);
      // fs find every file with *.config.json and ./sqlite/*.sqlite in __dirname
      const files = await fs.readdir(__dirname);
      const configFiles = files.filter(file => file.endsWith('.config.json'));
      const sqliteFiles = files.filter(file => file.endsWith('.sqlite'));
      for (const file of configFiles) {
        await fs.unlink(path.join(__dirname, file));
      }
      for (const file of sqliteFiles) {
        await fs.unlink(path.join(__dirname, file));
      }
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(`Error resetting wallet: ${e.message}`);
      } else {
        throw new Error('Error resetting wallet: unknown error');
      }
    }
  }

  addAccount(index: number){
    if (this.walletAccounts.has(index)) return this.storage.getAccountByIndex(index);
    const account = this.deriveAccount(this.masterSeed, index);
    this.storage.addAccount(new Account(account));
    this.walletAccounts.set(account.address, account);
    return account;
  }

  async send({recipient, amount, from, isRaw = false}: {recipient: string; amount: number; from: number; isRaw?: boolean}){
    const account = Array.from(this.walletAccounts.values()).find(a => a._index === from);

    if (!account) throw new Error("Account not found");
    const dnz = await this.Block().send(recipient, amount, account.keys.privateKey, isRaw);
    this.emit("send", dnz);
    return dnz;
  }

  async setRepresentative({ newRepresentative, accountIndex }: { newRepresentative: string; accountIndex: number }) {
    const accountEntry = Array.from(this.walletAccounts.values()).find(acc => acc._index === accountIndex);
    if (!accountEntry) throw new Error(`Account with index ${accountIndex} not found`);
    const donz = await this.Block().representative(newRepresentative, accountEntry.keys.privateKey);
    this.emit('representative', donz);
    return donz;
  }

  removeAccount(index: number) {
    if (index === 0) throw new Error("Cannot remove index account, use resetWallet() instead");
    const account = Array.from(this.walletAccounts.values()).find(a => a._index === index);
    if (!account) throw new Error("Account not found");
    this.storage.removeAccountByAddress(account.address);
    this.walletAccounts.delete(account.address);
  }

  getAccount(index: number) {
    const account = Array.from(this.walletAccounts.values()).find(a => a._index === index);
    if (!account) throw new Error("Account not found");
    return account;
  }
}

export { Wallet, nanoToRaw, rawToNano, InvoiceBuilder, InvoiceStatus, createQr, RPC, WebSocket };
