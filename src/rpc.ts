/** 

* Thanks to https://github.com/Benskalz/simple-nano-wallet-js/blob/main/wallet/ - adapted to use with typescript

*/

let fetch;
try {
  fetch = globalThis.fetch || require('node-fetch');
} catch (error) {
  fetch = require('node-fetch');
}

interface RPCParams {
  action: string;
  account?: string;
  representative?: string;
  hash?: string;
  json_block?: string;
  subtype?: string;
  block?: string;
  threshold?: string;
  count?: string;
}

interface RPCResponse {
  work?: string;
  blocks?: any[];
  error?: string;
  history?: any[];
}

class RPC {
  private rpcURL: string;
  private worURL: string;
  private headerAuth: Record<string, any>;

  /** 
  * Initializes the RPC client for blockchain queries.
  * @param {string} RPC_URL - The URL of the RPC endpoint.
  * @param {string} WORK_URL - The URL of the work server used to generate work; falls back to RPC if not provided.
  * @param {Record<string, any>} customHeaders - Optional headers for authentication.
  */
  constructor(RPC_URL: string, customHeaders: Record<string, string> = {}, WORK_URL?: string) {
    this.rpcURL = RPC_URL;
    this.worURL = WORK_URL || RPC_URL;
    this.headerAuth = customHeaders;
  }
  

  public async account_info(account: string): Promise<RPCResponse> {
    const params: RPCParams = {
      action: "account_info",
      account,
      representative: "true"
    };
    return this.req(params);
  }

  public async work_generate(hash: string): Promise<string> {
    const params: RPCParams = {
      action: "work_generate",
      hash,
    };

    const r = await this.req(params);
    if (!r.work) {
      throw new Error(`work_generate failed on ${this.worURL}: ${JSON.stringify(r)}`);
    }
    return r.work;
  }

  public async receivable(account: string): Promise<any[]> {
    const params: RPCParams = {
      action: "pending",
      account,
      threshold: "1",
    };

    const r = await this.req(params);
    return r.blocks || [];
  }

  public async getAccountHistory(account: string): Promise<any[]> {
    const params: RPCParams = {
      action: "account_history",
      account,
      count: "2" 
    };

    const r = await this.req(params);
    return r.history || [];
  }

  public async process(block: string, subtype: string): Promise<RPCResponse> {
    const params: RPCParams = {
      action: "process",
      json_block: "true",
      subtype,
      block
    };

    return this.req(params);
  }

  private async req(params: RPCParams): Promise<RPCResponse> {
    const url = params.action === "work_generate" ? this.worURL : this.rpcURL;
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
        ...this.headerAuth,
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
      });
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.statusText}`);
      }
      const data = await response.json() as RPCResponse;
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`RPC error: ${error.message}`);
      } else {
        throw new Error(`RPC error: ${error}`);
      }
    }
  }
}

export default RPC;
