import {ITx} from './interface';
import {ChainType, Tx, TxResp} from "../../types";
import rpc from "../../rpc";
import {accountService} from "../emit/account";

class TxService implements ITx {

    info = async (chain: ChainType, txHash: string): Promise<Tx> => {
        return await rpc.getTxInfo(chain, txHash)
    }

    list = async (chain: ChainType, symbol: string, pageSize: number, pageNo: number): Promise<TxResp> => {
        const account = await accountService.getAccount();
        return await rpc.getTransactions(chain, account.addresses[chain], symbol, "", pageSize, pageNo)
    }
}

export const txService = new TxService();