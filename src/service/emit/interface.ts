import {AccountModel,ChainType} from '@emit-technology/emit-types';

export interface IAccount {

    accounts: () => Promise<Array<AccountModel>>;

    // current: () => Promise<AccountModel>;

    signTx: () => Promise<any>;

    getAddress: (chain: ChainType) => Promise<string>;
}

