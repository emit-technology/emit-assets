import {AccountModel, ChainType} from "../../../types";
import EmitBox from '@emit-technology/emit-account-node-sdk';
import Web3 from 'web3';
import selfStorage from "../../../common/storage";
import config from "../../../common/config";
import BigNumber from "bignumber.js";
import {utils} from "../../../common/utils";

// const network:any = {
//     // nodeUrl: "https://easter-rpc.sero.cash",
//     nodeUrl: "https://node-account.emit.technology",
//     chainId:  "636",
//     chainType:  ChainType.ETH
// }
// const ethNetwork: any = {
//     nodeUrl: "https://mainnet.infura.io/v3/faa4639b090f46499f29d894da0551a0",
//     chainId: "1",
//     chainType: ChainType.ETH
// }


const dapp = {
    name: "emit-assets",
    url: "http://localhost:3000",
    category: "web3",
    contractAddress: ""
}

class AccountService {

    key = "ACCOUNT";

    emitBox: EmitBox;
    ethWeb3: Web3;
    bscWeb3: Web3;

    constructor() {
        const emitBox = new EmitBox(dapp, config.network[ChainType.EMIT]);
        const ethProvider = emitBox.newProvider({dapp: dapp, network: config.network[ChainType.ETH], version: "1.0"});
        const bscProvider = emitBox.newProvider({dapp: dapp, network: config.network[ChainType.BSC], version: "1.0"});

        console.info("ethProvider", ethProvider)
        this.emitBox = emitBox;
        this.ethWeb3 = new Web3(ethProvider);
        this.bscWeb3 = new Web3(bscProvider);
    }

    showWidget = () => {
        this.emitBox.showWidget().catch(e => {
            console.error(e)
        });
    }

    getAccount = async (): Promise<AccountModel> => {
        const account: AccountModel = selfStorage.getItem(this.key)
        return account
    }

    setAccount = async (account: AccountModel) => {
        selfStorage.setItem(this.key, account);
        return new Promise(resolve => {
            setInterval(() => {
                if (selfStorage.getItem(this.key)) {
                    resolve(account)
                }
            }, 200)
        })
    }

    getNonce = async (chain: ChainType): Promise<number> => {
        const account = await this.getAccount();
        const from = account.addresses[chain];
        return new Promise((resolve,reject) => {
            this.ethWeb3.eth.getTransactionCount(from, "pending", (error, nonce) => {
                if(error){
                    reject(error)
                }else{
                    resolve(utils.toValue(nonce,0).plus(1).toNumber())
                }
            })
        })
    }

    getGasPrice = async (): Promise<string> => {
        const gasPrice = await this.ethWeb3.eth.getGasPrice()
        return gasPrice;
    }

    estimateGas = async (txParams: any): Promise<number> => {
        return new Promise((resolve,reject) => {
            this.ethWeb3.eth.estimateGas(txParams,(err,ret)=>{
                if(err){
                    reject(err)
                }else{
                    resolve(ret);
                }
            })
        })
    }

    web3Send = async (chain: ChainType, receive: string, amountHex: string, data?: string) => {
        const account = await this.getAccount();
        const from = account.addresses[chain];
        const txConfig = {
            from: from,
            to: receive,
            value: amountHex,
            nonce: await this.getNonce(chain),
            gas: 25000,
            data:data,
            common: config.chainCommon
        }
        txConfig.gas = await this.estimateGas(txConfig);

        const rest = await accountService.ethWeb3.eth.sendTransaction(txConfig);
        return rest
    }
}

export const accountService = new AccountService();