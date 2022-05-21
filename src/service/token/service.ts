import {IToken} from './interface';
import {token_cache} from "../../memory/tokens";
import {AccountModel, Balance, ChainType} from "../../types";
import {Token} from "../../types/token";
import selfStorage from "../../common/storage";
import config from "../../common/config";
import {runWithLock} from 'localstorage-lock';
import {utils} from "../../common/utils";
import rpc from "../../rpc";
import {accountService} from "../emit/account";

class TokenService implements IToken {

    info = async (chain: ChainType, symbol: string): Promise<Token> => {
        const tokens:Array<Token> = await this.list();
        const rest = tokens.filter((v)=>{
            if(chain == v.chain  && v.symbol == symbol){
                return v;
            }
        })
        if(!rest || rest.length == 0){
            return Promise.reject(`Token[${symbol}] not exist on the ${ChainType[chain]} chain`);
        }
        return rest[0];
    }

    items = async (chain: ChainType): Promise<Array<Token>> => {
        const tokens:Array<Token> = await this.list();
        const rest = tokens.filter((v) => {
            if (chain == v.chain) {
                return v;
            }
        })
        return rest;
    }

    list = async (showHidden?:boolean): Promise<Array<Token>> => {
        const all:Array<Token> =  config.recommendTokens.concat(await this._addedTokens());
        if(!showHidden){
            const rest:Array<Token> = all.filter(v=>{
               const isHid = this.isHide(v);
               if (!isHid){
                   return true
               }
            })
            rest.sort(this._sortTokens)
            return rest;
        }
        all.sort(this._sortTokens)
        return all;
    }

    _sortTokens = (a:Token,b:Token) =>{
       return this.getSortNum(a) - this.getSortNum(b)
    }

    getTokenWithBalance = async (account: AccountModel,balance?:Balance):Promise<Array<Token>> => {
        const tokens:Array<Token> = [];
        const list = await this.list(false);
        for(let token of list){
            const key = this._balanceKey(token.chain,token.symbol,account.addresses[token.chain]);
            if(balance){
                token.balance = utils.fromValue(balance[key],token.decimal).toString(10)//utils.nFormatter(,4);
            }else{
                const rest = selfStorage.getItem(key);
                token.balance = utils.fromValue(rest,token.decimal).toString(10);//utils.nFormatter(,4);
            }
            tokens.push(token);
        }
        return tokens;
    }

    getTokenBalance = async (chain:ChainType,symbol:string):Promise<Token> =>{
        const account = await accountService.getAccount();
        const tokens = await this.getTokenWithBalance(account);
        const tkns = tokens.filter(value => {if (value.chain == chain && value.symbol==symbol){
            return true
        }})
        return tkns && tkns.length>0 && tkns[0]
    }

    getBalanceRemote = async (account: AccountModel):Promise<Array<Token>> => {
        const balance:Balance = {}
        for(let chain of config.chains){
            const prefix = rpc._getPrefix(chain)
            const rest: any = await rpc.post([prefix, "getBalance"].join("_"), [account.addresses[chain]], chain)
            const keys = Object.keys(rest);
            for(let symbol of keys){
                const b = rest[symbol];
                const key = this._balanceKey(chain,symbol,account.addresses[chain]);
                balance[key] = b;
                if(utils.fromValue(b,0).toNumber()>0){
                    selfStorage.setItem(key,utils.toHex(b))
                }
            }
        }
        return this.getTokenWithBalance(account,balance);
    }

    _balanceKey = (chain:ChainType,symbol:string,addr:string,)=>{
        return ["b",chain,symbol,addr.slice(0,8)].join("_")
    }


    _tokenHideKey = (chain: ChainType, symbol: string) => {
        return ["hid", chain, symbol].join("_")
    }

    _tokenSortKey = (chain: ChainType, symbol: string) => {
        return ["st", chain, symbol].join("_")
    }

    hide = (hide:boolean,token:Token) => {
        selfStorage.setItem(this._tokenHideKey(token.chain, token.symbol), hide)
    }

    isHide = (token:Token): boolean => {
        const ret = selfStorage.getItem(this._tokenHideKey(token.chain, token.symbol));
        if (ret) {
            return true;
        }
        return false;
    }

    setSortNum = (tokens:Array<Token>) => {
        let i = 0 ;
        for(let token of tokens){
            i++;
            selfStorage.setItem(this._tokenSortKey(token.chain, token.symbol), i+1)
        }
    }

    getSortNum = (token:Token): number => {
        const ret = selfStorage.getItem(this._tokenSortKey(token.chain, token.symbol));
        if (ret) {
            return ret;
        }
        return 0;
    }

    _addedTokens = async ():Promise<Array<Token>> =>{
        const _key = "token_added";
        let tokens: Array<Token> | undefined = selfStorage.getItem(_key);
        if (!tokens) {
            tokens = []
        }
        return Promise.resolve(tokens);
    }

    addToken = async (token: Token): Promise<boolean> => {
        const _key = "token_added";
        return new Promise(resolve => {
            runWithLock(`lock.${_key}`, () => {
                let tokens: Array<Token> | undefined = selfStorage.getItem(_key);
                if (!tokens) {
                    tokens = []
                }
                const ft = tokens.filter(v=>{
                    if(v.symbol == token.symbol && v.chain == token.chain){
                        return true
                    }
                })
                if(!ft){
                    tokens.push(token);
                    selfStorage.setItem(_key,tokens);
                }
                resolve(true)
            }, { timeout: 500 });
        })
    }


}

export const tokenService = new TokenService();