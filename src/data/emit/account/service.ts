import {IAccount} from './interface';
import {AccountModel, ChainType} from "../../../types";
import EmitBox from '@emit-technology/emit-account-node-sdk';
import Web3 from 'web3';
import {IonPage} from "@ionic/react";
import * as React from "react";

// const network:any = {
//     // nodeUrl: "https://easter-rpc.sero.cash",
//     nodeUrl: "https://node-account.emit.technology",
//     chainId:  "636",
//     chainType:  ChainType.ETH
// }
const network:any = {
    // nodeUrl: "https://easter-rpc.sero.cash",
    // nodeUrl: "https://node-account.emit.technology",
    nodeUrl: "https://mainnet.infura.io/v3/faa4639b090f46499f29d894da0551a0",
    chainId:  "1",
    chainType:  ChainType.ETH
}

const emitBox  = new EmitBox({
    name: "emit-cross",
    url: "http://localhost:3000",
    category: "web3",
    contractAddress: ""
}, network);

// emitBox.emitDataNode.
// emitBox.provider
const web3 = new Web3(emitBox.provider);

class AccountService implements IAccount {

    emitBox:EmitBox ;

    constructor(box: EmitBox) {
       this.emitBox = box;
    }

    accounts(): Promise<any> {
        const account = web3.eth.getAccounts()
        return account
    }

    showWidget =()=>{
        emitBox.showWidget();
    }
    //
    // current(): Promise<AccountModel> {
    //     // return Promise.resolve(undefined);
    //     return;
    // }

    getAddress(chain: ChainType): Promise<string> {
        return Promise.resolve("");
    }

    signTx(): Promise<any> {


        const account = "0x0bcbc7c8954ad7d1d52c1055deda1c0cad3eac30"
        web3.eth.sendTransaction({
                from: account,
                gasPrice: "0x2000000",
                gas: "0x21000",
                to: '0x4B687879f72cE693F1FEE347868f053592f45292',
                value: "0x10000",
            }
        ).then(value => {
            console.log(value,"value:")
        }).catch(e=>{
            console.log(e,"error:")
        })
        return;
    }

}

export const accountService = new AccountService(emitBox);