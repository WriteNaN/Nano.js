/**

* better-sqlite3 embedded localstorage

*/
interface IWalletStorage {
    initialize(): void;
    addAccount(account: Account): void;
    getAccount(accountId: string): Account | null;
    getAllAccounts(): Account[];
    resetWallet(): void;
    closeConnection(): void;
}
declare class WalletStorage implements IWalletStorage {
    private encryptionKey;
    private db;
    private db_path;
    private db_init_path;
    constructor(encryptionKey: string);
    initialize(): void;
    addAccount(account: IAccount): string;
    getAccount(accountId: string): IAccount | null;
    getAccountByAddress(address: string): IAccount | null;
    getAccountByIndex(index: number): IAccount | null;
    removeAccountByAddress(address: string): void;
    getAllAccounts(): IAccount[];
    resetWallet(): void;
    closeConnection(): void;
    private encryptData;
    private decryptData;
    private generateKey;
}
export interface IAccount {
    id?: number;
    address: string;
    _index: number;
    keys: Record<string, unknown>;
}
export declare class Account implements IAccount {
    id?: number;
    address: string;
    _index: number;
    keys: Record<string, unknown>;
    constructor({ address, keys, _index, }: {
        address: string;
        keys: Record<string, unknown>;
        _index: number;
    });
}
export default WalletStorage;
