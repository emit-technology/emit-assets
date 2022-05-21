import {ChainType, NftStandard, Token, TokenProtocol} from "../types";
import {INetwork} from "@emit-technology/emit-account-node-sdk";

/**
 * name: string;
 symbol: string;
 decimal: number;
 totalSupply: string;
 contractAddress: string;
 image?: string;
 protocol:TokenProtocol;
 chain: ChainType;
 */
interface IConfig {
    recommendTokens: Array<Token>;
    recommendNfts: Array<NftStandard>;
    chains: Array<ChainType>;
    emitAccountNodeHost: string;
    network: { [key: number]: INetwork };
    chainCommon: any
    exploreUrl: ExplorerUrl
}

interface ExplorerUrl {
    tx: { [chain: number]: string };
    address: { [chain: number]: string };
    contract: { [chain: number]: string };
    block: { [chain: number]: string };
}

const NODE_ENV: string = process.env.NODE_ENV || 'development';
const development: IConfig = {
    recommendTokens: [
        {
            name: "Ethereum Network",
            symbol: "ETH",
            decimal: 18,
            contractAddress: "",
            image: "./assets/img/tokens/ETH.png",
            protocol: TokenProtocol.ETH,
            chain: ChainType.ETH
        },
        {
            name: "BNB",
            symbol: "BNB",
            decimal: 18,
            contractAddress: "",
            image: "./assets/img/tokens/BNB.png",
            protocol: TokenProtocol.BSC,
            chain: ChainType.BSC
        },
        {
            name: "EMIT LIGHT Element",
            symbol: "bLIGHT",
            decimal: 18,
            contractAddress: "0x944854f404c7C0dF9780651D9B29947C89D8fD19",
            image: "./assets/img/tokens/bLIGHT.png",
            protocol: TokenProtocol.BEP20,
            chain: ChainType.BSC
        },
        {
            name: "eLIGHT",
            symbol: "eLIGHT",
            decimal: 18,
            contractAddress: "0xD48f0cd85B983ac647E09ed06Ae148f458D06A57",
            image: "./assets/img/tokens/eLIGHT.png",
            protocol: TokenProtocol.ERC20,
            chain: ChainType.ETH
        },
        {
            name: "EMIT DARK Element",
            symbol: "bDARK",
            decimal: 18,
            contractAddress: "0xE35Aa1adEbF5484482fAAdCBFD5729234f0ABf29",
            image: "./assets/img/tokens/DARK.png",
            protocol: TokenProtocol.BEP20,
            chain: ChainType.BSC
        },
        {
            name: "EMIT EARTH Element",
            symbol: "EARTH",
            decimal: 18,
            contractAddress: "0xEA8553CCbbf14A628750a56078aA7da425bdAe08",
            image: "./assets/img/tokens/EARTH.png",
            protocol: TokenProtocol.BEP20,
            chain: ChainType.BSC
        },

        {
            name: "EMIT WATER Element",
            symbol: "WATER",
            decimal: 18,
            contractAddress: "0xCee118d0fD2A765a91f6bbD251C41Ac93a4298F7",
            image: "./assets/img/tokens/WATER.png",
            protocol: TokenProtocol.BEP20,
            chain: ChainType.BSC
        },
        {
            name: "Binance-Peg BUSD",
            symbol: "BUSD",
            decimal: 18,
            contractAddress: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
            image: "./assets/img/tokens/BUSD.png",
            protocol: TokenProtocol.BEP20,
            chain: ChainType.BSC
        },
        {
            name: "USDT",
            symbol: "USDT",
            decimal: 6,
            contractAddress: "0xdac17f958d2ee523a2206206994597c13d831ec7",
            image: "./assets/img/tokens/USDT.png",
            protocol: TokenProtocol.ERC20,
            chain: ChainType.ETH
        },
        {
            name: "Super ZERO",
            symbol: "eSERO",
            decimal: 18,
            contractAddress: "0x944854f404c7C0dF9780651D9B29947C89D8fD19",
            image: "./assets/img/tokens/SERO.png",
            protocol: TokenProtocol.ERC20,
            chain: ChainType.ETH
        },
    ],
    recommendNfts: [],
    chains: [ChainType.EMIT, ChainType.ETH, ChainType.BSC],
    emitAccountNodeHost: "http://127.0.0.1:7655",
    network: {
        [ChainType.ETH]: {nodeUrl: "http://127.0.0.1:8545", chainId: "15", chainType: ChainType.ETH},
        [ChainType.BSC]: {nodeUrl: "http://127.0.0.1:8545", chainId: "1", chainType: ChainType.BSC},
        [ChainType.EMIT]: {nodeUrl: "https://easter-rpc.sero.cash", chainId: "667", chainType: ChainType.EMIT},
    },
    chainCommon: {
        baseChain: "mainnet",
        customer: {
            name: "mainnet",
            networkId: 15,
            chainId: 1337,
        },
        hardfork: "petersburg"
    },
    exploreUrl: {
        tx:{
            [ChainType.ETH]: "https://etherscan.io/tx/{0}",
            [ChainType.BSC]: "https://bscscan.com/tx/{0}",
            [ChainType.EMIT]: "https://bscscan.com/tx/{0}",
        },
        block:{
            [ChainType.ETH]: "https://etherscan.io/block/{0}",
            [ChainType.BSC]: "https://bscscan.com/block/{0}",
            [ChainType.EMIT]: "https://bscscan.com/block/{0}",
        },
        address:{
            [ChainType.ETH]: "https://etherscan.io/address/{0}",
            [ChainType.BSC]: "https://bscscan.com/address/{0}",
            [ChainType.EMIT]: "https://bscscan.com/address/{0}",
        },
        contract:{
            [ChainType.ETH]: "https://etherscan.io/address/{0}",
            [ChainType.BSC]: "https://bscscan.com/address/{0}",
            [ChainType.EMIT]: "https://bscscan.com/address/{0}",
        }
    }
};

const production: IConfig = {
    recommendTokens: development.recommendTokens,
    recommendNfts: [
        // {symbol: "eEMIT_BUILDERS_MEDAL_01", name: "EMIT BUILDERS MEDAL 01",contract_address: "0xd5e8b33dceaf121a0aeef03777b7bff94b141167",  protocol: NftProtocol.ERC721, chain: ChainType.ETH },
        // {symbol: "eWRAPPED_EMIT_AX", name: "eWRAPPED_EMIT_AX",contract_address: "0x1780CE9bA71E115bb36781a22B858b54fC0d93CE",  protocol: NftProtocol.ERC721, chain: ChainType.ETH },
        // {symbol: "bWRAPPED_EMIT_AX", name: "bWRAPPED_EMIT_AX",contract_address: "0x9036b1c89FA26d90751cf42BBea626a5fD379b23",  protocol: NftProtocol.ERC721, chain: ChainType.BSC },
        // {symbol: "COUNTER", name: "EMIT COUNTER",contract_address: "0xC0c901368483b217d66a2560f514df6EF3Df3624",  protocol: NftProtocol.ERC721, chain: ChainType.BSC },
    ],
    chains: [ChainType.EMIT, ChainType.ETH, ChainType.BSC],
    emitAccountNodeHost: "http://node-account.emit.technology",
    network: {
        [ChainType.ETH]: {nodeUrl: "http://127.0.0.1:8545", chainId: "1", chainType: ChainType.ETH},
        [ChainType.BSC]: {nodeUrl: "http://127.0.0.1:8545", chainId: "1", chainType: ChainType.BSC},
        [ChainType.EMIT]: {nodeUrl: "https://easter-rpc.sero.cash", chainId: "667", chainType: ChainType.EMIT},
    },
    chainCommon: {
        baseChain: "mainnet",
        customer: {
            name: "mainnet",
            networkId: 1,
            chainId: 1,
        },
        hardfork: "byzantium"
    },
    exploreUrl: {
        tx:{
            [ChainType.ETH]: "https://etherscan.io/tx/{0}",
            [ChainType.BSC]: "https://bscscan.com/tx/{0}",
            [ChainType.EMIT]: "https://bscscan.com/tx/{0}",
        },
        block:{
            [ChainType.ETH]: "https://etherscan.io/block/{0}",
            [ChainType.BSC]: "https://bscscan.com/block/{0}",
            [ChainType.EMIT]: "https://bscscan.com/block/{0}",
        },
        address:{
            [ChainType.ETH]: "https://etherscan.io/address/{0}",
            [ChainType.BSC]: "https://bscscan.com/address/{0}",
            [ChainType.EMIT]: "https://bscscan.com/address/{0}",
        },
        contract:{
            [ChainType.ETH]: "https://etherscan.io/address/{0}",
            [ChainType.BSC]: "https://bscscan.com/address/{0}",
            [ChainType.EMIT]: "https://bscscan.com/address/{0}",
        }
    }
};

const config: {
    [name: string]: IConfig
} = {
    development,
    production
};

export default config[NODE_ENV];
