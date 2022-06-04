import rpc from "../../rpc";
import config from "../../common/config";
import {CrossConfig, CrossResource, CrossToken} from "../../types/cross";
import {AccountModel,ChainType} from '@emit-technology/emit-types';
class Config {

    private _cfg: CrossConfig;

    init = async (): Promise<CrossConfig> => {
        if(this._cfg){
            return this._cfg;
        }
        this._cfg = await rpc.get(`${config.crossConfigUrl}/crossConfig`)
        return this._cfg;
    }

    getTokenContractHandle = async (chain:ChainType):Promise<string> =>{
        const cfg = await this.init();
        return cfg["token"].contract[ChainType[chain]]["handler"]
    }

    getTokenContractBridge = async (chain:ChainType):Promise<string> =>{
        const cfg = await this.init();
        return cfg["token"]["contract"][ChainType[chain]]["bridger"]
    }
    getTokenContractFee = async (chain:ChainType):Promise<string> =>{
        const cfg = await this.init();
        return cfg["token"].contract[ChainType[chain]]["fee"]
    }

    getTargetTokens = async (fromSymbol:string,fromChain: ChainType,tokenAddress:string):Promise<CrossResource> =>{
        const cfg = await this.init();
        const data = cfg["token"].resourceId;
        const tags = Object.keys(data);
        for(let tag of tags){
            const crossResource = data[tag];
            const resourceIds = Object.keys(crossResource);
            for(let resourceId of resourceIds){
                const chainTokenInfo = crossResource[resourceId];
                if(chainTokenInfo[ChainType[fromChain]]){
                    const tokenInfo = chainTokenInfo[ChainType[fromChain]];
                    if(tokenInfo.symbol == fromSymbol && tokenInfo.erc20.toLowerCase() == tokenAddress.toLowerCase()){
                        return crossResource
                    }
                }
            }
        }
        return {}
    }

    getTargetNfts = async (fromSymbol:string,fromChain: ChainType):Promise<CrossResource> =>{
        const cfg = await this.init();
        const data = cfg["nft"].resourceId;
        const tags = Object.keys(data);
        for(let tag of tags){
            const crossResource = data[tag];
            const resourceIds = Object.keys(crossResource);
            for(let resourceId of resourceIds){
                const chainTokenInfo = crossResource[resourceId];
                if(chainTokenInfo[ChainType[fromChain]]){
                    return crossResource
                }
            }
        }
        return {}
    }

}

export const crossConfig = new Config();