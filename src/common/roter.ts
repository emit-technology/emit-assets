import {ChainType} from "../types";
import {interVarBalance} from "./interVal";

class Router {

    private _go = (path: string) => {
        interVarBalance.latestOpTime = Date.now();
        const data: any = sessionStorage.getItem("history");
        const pre = window.location.hash;
        const pathArr = data && JSON.parse(data);
        if (pathArr && pathArr.length > 0) {
            pathArr.push(pre);
            sessionStorage.setItem("history", JSON.stringify(pathArr))
        } else {
            sessionStorage.setItem("history", JSON.stringify([pre]))
        }
        window.location.href = `#/${path}`
        // window.location.reload();
        return;
    }

    nftItems = (chain: ChainType, address: string, symbol: string) => {
        this._go(["nft", chain, symbol, address].join("/"));
    }

    nftDetail = (chain: ChainType, address: string, symbol: string, tokenId) => {
        this._go(["nft", chain, address, symbol, tokenId].join("/"));
    }

    addressReceive = (chain: ChainType, symbol: string, address: string) => {
        this._go(["address/receive", chain, address, symbol].join("/"));
    }

    transferToken = (chain: ChainType, symbol: string) => {
        this._go(["send/token", chain, symbol].join("/"));
    }

    transferNft = (chain: ChainType, tokenId: string) => {
        this._go(["send/nft", chain, tokenId].join("/"));
    }

    txList = (chain: ChainType, symbol: string) => {
        this._go(["tx/list", chain, symbol].join("/"));
    }

    txInfo = (chain: ChainType, txHash: string) => {
        this._go(["tx/info", chain, txHash].join("/"));
    }

    home = () => {
        this._go("/")
    }

    back = () => {
        interVarBalance.latestOpTime = Date.now();
        const data: any = sessionStorage.getItem("history");
        const pathArr = data && JSON.parse(data)
        if (pathArr && pathArr.length > 0) {
            const pre = pathArr.pop();
            sessionStorage.setItem("history", JSON.stringify(pathArr));
            window.location.href = `${pre}`;
            // window.location.reload();
        } else {
            this.home();
        }
    }
}

export const oRouter = new Router();