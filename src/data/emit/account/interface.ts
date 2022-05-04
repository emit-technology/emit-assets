import {AccountModel, ChainType} from "../../../types";

export interface IAccount {

    accounts: () => Promise<Array<AccountModel>>;

    // current: () => Promise<AccountModel>;

    signTx: () => Promise<any>;

    getAddress: (chain: ChainType) => Promise<string>;
}

