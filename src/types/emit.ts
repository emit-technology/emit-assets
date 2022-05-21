export interface AccountModel {
    accountId?: string
    name: string
    avatar?: string
    addresses?: { [chainType: number]: string }
    createType?: CreateType;
}

export enum CreateType {
    Mnemonic,
    PrivateKey,
}

export enum ChainType {
    _,
    SERO,
    ETH,
    TRON,
    BSC,
    EMIT
}

export interface Inbox {
    block: number;
    index: number;
    from: string;
    timestamp: number;
    amount: string;

    token: string;
    tokenHash: string;
}

export interface Balance {
    [chain_symbol_address:string]: string;
}