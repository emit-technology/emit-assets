import axios from "axios";
import {AccountModel, Balance, ChainType, Token, TxDetail} from "../types";
import {accountService} from "../service/emit/account";
import selfStorage from "../common/storage";
import config from "../common/config";
import {utils} from "../common/utils";
import {tokenService} from "../service/token";

class RPC {

    messageId: number;
    host: string;

    constructor(host: string) {
        this.messageId = 0;
        this.host = host;
    }

    _getPrefix(chain: ChainType) {
        if (chain == ChainType.BSC) {
            return "eth"
        } else {
            return ChainType[chain].toLowerCase();
        }
    }

    req = async (url: string, data: any) => {
        const resp = await axios.post(this.host, data)
        return resp.data;
    }

    get = async (url: string) => {
        const resp = await axios.get(url);
        return resp.data
    }

    post = async (method: any, params: any, chain: ChainType):Promise<any> => {
        const data: any = {
            id: this.messageId++,
            jsonrpc: '2.0',
            method: method,
            params: params,
        };
        if (chain) {
            axios.defaults.headers.post['chain'] = chain;
        }
        return new Promise((resolve, reject) => {
            axios.post(this.host, data, {
                headers: {}
            }).then((resp: any) => {
                if (resp.data.error) {
                    reject(typeof resp.data.error === "string" ? resp.data.error : resp.data.error.message);
                } else {
                    resolve(resp.data.result);
                }
            }).catch((e: any) => {
                console.error("rpc post err: ", e)
                reject(e)
            })
        })
    }

    async postWithHost(method: any, params: any, host: string) {
        const data: any = {
            id: this.messageId++,
            jsonrpc: '2.0',
            method: method,
            params: params,
        };
        return new Promise((resolve, reject) => {
            axios.post(host, data, {}).then((resp: any) => {
                if (resp.data.error) {
                    reject(typeof resp.data.error === "string" ? resp.data.error : resp.data.error.message);
                } else {
                    resolve(resp.data.result);
                }
            }).catch((e: any) => {
                reject(e)
            })
        })
    }

    initNFT = async () => {
        console.log("init NFT...")
        const account = await accountService.getAccount();
        if (account && account.addresses) {
            // await this.getTicketEth(account.addresses[ChainType.ETH])
            // await this.getTicketBSC(account.addresses[ChainType.BSC])
        }
    }


    getTransactions = async (chain: ChainType, address: string, cy: string, hash: string, pageSize: number, pageNo: number, fingerprint?: string) => {
        const prefix = this._getPrefix(chain)
        const rest: any = await this.post([prefix, "getTransactions"].join("_"), [address, cy, hash, pageSize, pageNo, fingerprint], chain)
        return rest;
    }

    getTransactionReceipt = async (chain: ChainType, hash: string) => {
        const prefix = this._getPrefix(chain)
        const rest: any = await this.post([prefix, "getTransactionReceipt"].join("_"), [hash], chain)
        return rest;
    }

    getTxInfo = async (chain: ChainType, txHash: string) :Promise<TxDetail> => {
        const prefix = this._getPrefix(chain)
        const rest: TxDetail = await this.post([prefix, "getTxInfo"].join("_"), [txHash], chain)
        return rest;
    }

    getEvents = async (chain: ChainType, txHash: string, depositNonce: string, originChainID: string, resourceID: string) => {
        const prefix = this._getPrefix(chain)
        const rest: any = await this.post([prefix, "getEvents"].join("_"), [txHash, depositNonce, originChainID, resourceID], chain)
        return rest;
    }

    getTransactionByHash = async (txHash: string, chain: ChainType) => {
        return await this.post(chain == ChainType.SERO ? "sero_getTransactionByHash" : "eth_getTransactionByHash", [txHash], chain);
    }

}

const rpc = new RPC(config.emitAccountNodeHost);

export default rpc