import {ChainType} from "./emit";

export interface Token {
    name: string;
    symbol: string;
    decimal: number;
    totalSupply?: string;
    contractAddress: string;
    image?: string;
    protocol: TokenProtocol;
    chain: ChainType;
    balance?: string
}

export enum TokenProtocol {
    ERC20 = "ERC20",
    BEP20 = "BEP20",
    EMIT = "EMIT",
    BSC = "BSC",
    ETH = "ETH"
}