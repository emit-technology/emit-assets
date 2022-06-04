import {IGas} from './interface';
import {AccountModel,ChainType} from '@emit-technology/emit-types';
import {utils} from "../../common/utils";

class GasService implements IGas {

    defaultGas = (chain:ChainType) =>{
        if(utils.isWeb3Chain(chain)){
            return "21000"
        }
        return "0"
    }
}

export const gasService = new GasService();