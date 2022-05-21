import {ChainType, Tx, TxResp} from "../../types";

export interface ITx {

    list: (chain:ChainType,symbol:string,pageSize:number,pageNo:number) => Promise<TxResp>;

    info: (chain:ChainType,txHash:string) => Promise<Tx>;

}

