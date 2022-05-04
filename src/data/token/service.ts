import {IToken} from './interface';
import {token_cache} from "../../memory/tokens";
import {ChainType} from "../../types";
import {Token} from "../../types/token";

class TokenService implements IToken {

    // @ts-ignore
    info = async (chain:ChainType,symbol:string): Promise<Token> => {
        // const rest = nft_cache.filter((v)=>{
        //     if(chain == v.chain && address == v.contract_address && symbol == v.symbol && tokenId == v.token_id){
        //         return v;
        //     }
        // })
        return token_cache[token_cache.length-1];
    }

    // @ts-ignore
    items= async (chain:ChainType): Promise<Array<Token>> => {
        const rest = token_cache.filter((v)=>{
            if(chain == v.chain){
                return v;
            }
        })
        return rest;
    }

    // @ts-ignore
    list =async (): Promise<Array<Token>> => {
        // const rest = nft_cache.filter((v)=>{
        //    if(chain == v.chain && address == v.contract_address){
        //        return v;
        //    }
        // })
        return token_cache;
    }


}

export const tokenService = new TokenService();