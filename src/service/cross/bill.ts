import rpc from "../../rpc";
import config from "../../common/config";
import {AccountModel,ChainType} from '@emit-technology/emit-lib';
import {emitBoxSdk} from "../emit";
import {CrossBill} from "../../types/cross";
import EthCross from "../../contract/cross/eth";
import BigNumber from "bignumber.js";
import {txService} from "../tx";
import {crossConfig} from "./config";

class Bill {

    constructor() {

    }

    list = async (chain: ChainType): Promise<Array<CrossBill>> => {
        const account = await emitBoxSdk.getAccount();
        const items: Array<CrossBill> = await rpc.get(`${config.crossConfigUrl}/bills/${account.addresses[chain]}/${chain}`);
        return items
    }

    commitVote = async (bill: CrossBill): Promise<{ transactionHash: string, chain: ChainType }> => {
        // const account = await emitBoxSdk.getAccount();
        const chain = bill.DestinationId;
        const addresses = await emitBoxSdk.web3[chain].eth.getAccounts();
        const address = addresses[0];
        const contract = new EthCross(address, chain);
        const data = await contract.commitVotes(bill.SourceId, bill.DepositNonce, bill.ResourceId, bill.recipient, new BigNumber(bill.amount), bill.callbackParam, bill.signatures);
        const bridgeAddress = await crossConfig.getTokenContractBridge(chain)
        const tx = await txService._web3Send(chain, bridgeAddress, "0x0", 18, data)
        await txService.waitTxConfirm(chain, tx.transactionHash)
        return {transactionHash: tx.transactionHash, chain: chain};
    }

}

export const crossBillService = new Bill();