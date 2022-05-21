import {IGas} from './interface';
import {ChainType} from "../../types";

class GasService implements IGas {

    defaultGas = (chain:ChainType) =>{
        if(chain == ChainType.ETH || chain == ChainType.BSC){
            return "25000"
        }
        return "0"
    }
}

export const gasService = new GasService();