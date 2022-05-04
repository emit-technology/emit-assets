import {ChainType} from "../types";

class Router {

    private _go = (uri: string) => {
        window.location.href = `#/${uri}`;
    }

    nftItems = (chain:ChainType,address: string, symbol: string) => {
        this._go(["nft",chain, symbol, address].join("/"));
    }

    nftDetail = (chain:ChainType,address: string, symbol: string, tokenId) => {
        this._go(["nft",chain, address, symbol, tokenId].join("/"));
    }

    addressReceive = (chain:ChainType,symbol:string) =>{
        let address = "";
        //TODO
        address = "sss"
        this._go(["address/receive",chain,address, symbol].join("/"));
    }

    transferToken = (chain:ChainType,symbol:string) =>{
        this._go(["send/token",chain, symbol].join("/"));
    }

    transferNft = (chain:ChainType,tokenId:string) =>{
        this._go(["send/nft",chain, tokenId].join("/"));
    }

    txList = (chain:ChainType,symbol:string) =>{
        this._go(["tx/list",chain, symbol].join("/"));
    }

    txInfo = (chain:ChainType,txHash:string) =>{
        this._go(["tx/info",chain, txHash].join("/"));
    }

    back = ()=>{
        window.history.back();
    }
}

export const oRouter = new Router();