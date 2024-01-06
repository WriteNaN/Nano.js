/**

* better-sqlite3 embedded localstorage

*/

import Database from 'better-sqlite3';
import path from 'path';
import crypto from 'crypto';
require('@babel/register')({
  extensions: ['.js', '.ts'],
});


import goodbye from "graceful-goodbye";
import { v4 as uuid } from "uuid";
import fs from 'fs';
import { fileURLToPath } from 'url';

// @ts-ignore
global.__filename = (typeof __filename !== 'undefined') ? __filename : fileURLToPath(import.meta.url);
global.__dirname = (typeof __dirname !== 'undefined') ? __dirname : require('path').dirname(global.__filename);

interface IWalletStorage {
  initialize(): void;
  addAccount(account: Account): void;
  getAccount(accountId: string): Account | null;
  getAllAccounts(): Account[];
  resetWallet(): void;
  closeConnection(): void;
}

class WalletStorage implements IWalletStorage {
  private encryptionKey: string;
  private db: any;
  private db_path: string;
  private db_init_path: string;

  constructor(encryptionKey: string) {
    this.encryptionKey = encryptionKey;
    this.db_init_path = crypto.scryptSync(crypto.createHash("sha256").update(encryptionKey).digest("hex"), "salt", 16).toString("hex");
    this.db_path = path.join(__dirname, 'sqlite', `${this.db_init_path}.sqlite`);
    fs.mkdirSync(path.dirname(this.db_path), { recursive: true });
    if (!fs.existsSync(this.db_path)) fs.writeFileSync(this.db_path, '');
    this.db = new Database(this.db_path);

    this.initialize();

    goodbye(async () => {
      console.log("gracefully closed wallet connection");
      this.closeConnection();
    });
  }

  initialize(): void {
    try {
      //db.exec('ALTER TABLE accounts ADD COLUMN address TEXT;'); debug
      this.db.exec(`CREATE TABLE IF NOT EXISTS accounts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        address TEXT,
        keys BLOB,
        _id TEXT,
        _index INTEGER
      );`);
      //console.log('Database initialized.');
    } catch (error) {
      console.error('Error initializing database:', error);
      process.exit(1);
    }
  }

  addAccount(account: IAccount): string {
    try {
      const _id = uuid();
      const encryptedKeys = this.encryptData(JSON.stringify(account.keys));
      const stmt = this.db.prepare('INSERT INTO accounts (_id, address, keys, _index) VALUES (?, ?, ?, ?)');
      stmt.run(_id, account.address, encryptedKeys, account._index);
      return _id;
    } catch (error) {
      console.error('Error adding account:', error);
      return '';
    }
  }


  getAccount(accountId: string): IAccount | null {
    try {
      const stmt = this.db.prepare('SELECT * FROM accounts WHERE _id = ?');
      const account = stmt.get(accountId);
      if (account) {
        account.keys = JSON.parse(this.decryptData(account.keys));
        return account;
      }
      return null;
    } catch (error) {
      console.error('Error getting account:', error);
      return null;
    }
  }

  getAccountByAddress(address: string): IAccount | null {
    try {
      const stmt = this.db.prepare('SELECT * FROM accounts WHERE address = ?');
      const account = stmt.get(address);
      if (account) {
        account.keys = JSON.parse(this.decryptData(account.keys));
        return account;
      }
      return null;
    } catch (error) {
      console.error('Error getting account by address:', error);
      return null;
    }
  }

  getAccountByIndex(index: number): IAccount | null {
    try {
      const stmt = this.db.prepare('SELECT * FROM accounts WHERE _index = ?');
      const account = stmt.get(index);
      if (account) {
        account.keys = JSON.parse(this.decryptData(account.keys));
        return account;
      }
      return null;
    } catch (error) {
      console.error('Error getting account by address:', error);
      return null;
    }
  }

  removeAccountByAddress(address: string): void {
    try {
      const stmt = this.db.prepare('DELETE FROM accounts WHERE address = ?');
      stmt.run(address);
    } catch (error) {
      console.error('Error removing account by address:', error);
    }
  }

  getAllAccounts(): IAccount[] {
    try {
      const stmt = this.db.prepare('SELECT * FROM accounts');
      return stmt.all().map((account: any) => ({
        ...account,
        keys: JSON.parse(this.decryptData(account.keys)),
      }));
    } catch (error) {
      console.error('Error getting all accounts:', error);
      return [];
    }
  }

  resetWallet(): void {
    try {
      this.db.exec('DROP TABLE IF EXISTS accounts');
      console.log('Cleaned db');
      this.db.exec(`CREATE TABLE IF NOT EXISTS accounts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        address TEXT,
        keys BLOB,
        _id TEXT,
        _index INTEGER
      );`);
    } catch (error) {
      console.error('Error deleting entire wallet:', error);
    }
  }

  closeConnection(): void {
    try {
      this.db.close();
      //console.log('Database connection closed.');
    } catch (error) {
      console.error('Error closing database connection:', error);
    }
  }

  private encryptData(data: string): Buffer {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', this.generateKey(this.encryptionKey), iv);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return Buffer.concat([iv, Buffer.from(encrypted, 'hex')]);
  }


  private decryptData(encryptedData: Buffer): string {
    const iv = encryptedData.subarray(0, 16);
    const actualEncryptedData = encryptedData.subarray(16);
    const decipher = crypto.createDecipheriv('aes-256-cbc', this.generateKey(this.encryptionKey), iv);
    let decrypted = decipher.update(actualEncryptedData.toString('hex'), 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  private generateKey(pass: string): Buffer {
    const key = crypto.scryptSync(pass, Buffer.from(crypto.createHash('sha512').update(pass).digest('hex')).subarray(0, 16), 32);
    return key;
  }
}

export interface IAccount {
  id?: number;
  address: string;
  _index: number;
  keys: Record<string, unknown>;
}

export class Account implements IAccount {
  id?: number;
  address: string;
  _index: number;
  keys: Record<string, unknown>;

  constructor({
    address,
    keys,
    _index,
  }: {
    address: string;
    keys: Record<string, unknown>;
    _index: number;
  }) {
    this.address = address;
    this.keys = keys;
    this._index = _index;
  }
}


export default WalletStorage;
