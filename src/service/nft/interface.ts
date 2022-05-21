import {NftStandard} from "../../types/nft";
import {ChainType} from "../../types";

export interface INft {
    list: (chain:ChainType,address:string) => Promise<Array<NftStandard>>;

    info: (chain:ChainType,address:string,symbol:string,tokenId:any) => Promise<NftStandard>;

    items: (chain:ChainType,address:string,symbol:string)=> Promise<Array<NftStandard>>;
}

