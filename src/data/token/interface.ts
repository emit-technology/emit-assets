import {ChainType} from "../../types";
import {Token} from "../../types/token";

export interface IToken {
    list: () => Promise<Array<Token>>;

    info: (chain:ChainType,symbol:string) => Promise<Token>;

    items: (chain:ChainType)=> Promise<Array<Token>>;
}

