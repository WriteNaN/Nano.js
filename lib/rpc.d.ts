/**

* Thanks to https://github.com/Benskalz/simple-nano-wallet-js/blob/main/wallet/ - adapted to use with typescript

*/
interface RPCResponse {
    work?: string;
    blocks?: any[];
    error?: string;
    history?: any[];
}
declare class RPC {
    private rpcURL;
    private worURL;
    private headerAuth;
    /**
    * Initializes the RPC client for blockchain queries.
    * @param {string} RPC_URL - The URL of the RPC endpoint.
    * @param {string} WORK_URL - The URL of the work server used to generate work; falls back to RPC if not provided.
    * @param {Record<string, any>} customHeaders - Optional headers for authentication.
    */
    constructor(RPC_URL: string, customHeaders?: Record<string, string>, WORK_URL?: string);
    account_info(account: string): Promise<RPCResponse>;
    work_generate(hash: string): Promise<string>;
    receivable(account: string): Promise<any[]>;
    getAccountHistory(account: string): Promise<any[]>;
    process(block: string, subtype: string): Promise<RPCResponse>;
    private req;
}
export default RPC;
