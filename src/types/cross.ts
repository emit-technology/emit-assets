import {ChainType} from '@emit-technology/emit-lib';
import {BlockWrapped} from "@emit-technology/emit-lib";

export interface CrossConfig {
    [assetType: string]: AssetItem
}

interface AssetItem {
    contract: Contract,
    resourceId: CrossTag
}

interface Contract {
    [chain: string]: ContractAddress
}

interface ContractAddress {
    handler: string,
    bridger: string,
    fee: string
}

export interface CrossTag {
    [symbol: string]: CrossResource
}

export interface CrossResource {
    [resourceId: string]: CrossToken //[ETH]
}

export interface CrossToken {
    [chain: string]: Token
}

interface Token {
    symbol: string;
    erc20: string
}

export enum TransferType {
    _,
    token,
    nft,
}

export interface CrossBill {
    transferType: TransferType,
    SourceId: ChainType,
    DestinationId: ChainType,
    DepositNonce: number,
    ResourceId: string,
    recipient: string
    callbackParam: string,
    amount: string,
    signatures: Array<string>
    timestamp: number;
    symbol: string;
    erc20: string
    depositBlock: null | BlockWrapped
}

export interface CrossData {
    transferType: TransferType,
    sourceId: ChainType,
    destinationChainID: ChainType,
    resourceId: string,
    recipient: string,
    callback: string,
    sender: string,
    txHash: string
}