import * as React from 'react';
import {
    IonCol,
    IonContent,
    IonHeader,
    IonIcon,
    IonItem,
    IonLabel, IonBadge,
    IonPage,
    IonRow, IonText,
    IonTitle,
    IonToolbar, IonToast
} from '@ionic/react';
import {
    arrowBackOutline,
    checkmarkCircleOutline, copyOutline,
} from "ionicons/icons";
import './index.css';
import {Token, TxDetail} from "../../types";
import {ChainType} from '@emit-technology/emit-lib';
import {oRouter} from "../../common/roter";
import {QRCodeSVG} from 'qrcode.react';
import {utils} from "../../common/utils";
import {tokenService} from "../../service/token";
import config from "../../common/config";
import {emitBoxSdk} from "../../service/emit";
import {txService} from "../../service/tx";
import BigNumber from "bignumber.js";
import {TokenIcon} from "../../components/Tokens/TokenIcon";
import copy from "copy-to-clipboard";

interface Props {
    refresh: number;
    chain: ChainType;
    txHash: string;
    blockNum: null;
}

interface State {
    txDetail?: TxDisplay
    showToast: boolean
    toastMsg: string
}

interface TxDisplay {
    from: string;
    to: Array<string>;
    amountWithCy: Array<AmountWithCy>;
    txHash: string;
    time: string;
    type: string;
    url: string;
    fee: string;
    gasLimit: string;
    gasPrice: string;
    num:number
}

interface AmountWithCy{
    amountDesc:string;
    token:Token
}

export class TxInfo extends React.Component<Props, State> {

    state: State = {showToast:false,toastMsg:""}

    componentDidMount() {
        this.init().catch(e => {
            console.error(e)
        })
    }

    _convertToTxDisplay = async (txDetail: TxDetail): Promise<TxDisplay> => {
        const account = await emitBoxSdk.getAccount();
        const {chain} = this.props;
        let type = "", amount:Array<AmountWithCy> = [];

        const address = account.addresses[chain];
        const toAddress:Array<string> = [];
        if (txDetail.records) {
            //from
            {
                const records = txDetail.records.filter(v => {
                    if (v.address.toLowerCase() == address.toLowerCase()) {
                        return v
                    }
                })
                if (records && records.length > 0) {
                    for (let record of records) {
                        if(new BigNumber(record.amount).toNumber() == 0 ){
                            continue
                        }
                        const token = await tokenService.info(chain, record.currency);
                        const value = utils.fromValue(record.amount, token.decimal);
                        const sym = value.toNumber()>0?"+ ":""
                        amount.push({token:token,amountDesc:`${sym}${value.toString(10)} ${record.currency}`})
                        type = value.toNumber() > 0 ? "Receive" : "Sent";
                    }
                }
            }
            {

                const records = txDetail.records.filter(v => {
                    if (v.address.toLowerCase() != address.toLowerCase()) {
                        return v
                    }
                })
                if (records && records.length > 0) {
                    for (let record of records) {
                        if(new BigNumber(record.amount).toNumber() == 0 ){
                            continue
                        }
                        toAddress.push(record.address)
                    }
                }
            }
        }
        let addrs:Array<string> = [];
        for(let amt of amount){
            if(txDetail.toAddress && txDetail.toAddress.length>0){
               addrs = txDetail.toAddress.filter(v=> v.toLowerCase() != amt.token.contractAddress.toLowerCase())
            }
        }
        return {
            from: txDetail.fromAddress,
            to: addrs.concat(toAddress),
            amountWithCy: amount,
            txHash: txDetail.txHash,
            time: utils.dateFormat(new Date(txDetail.timestamp * 1000)),
            type: type,
            num: txDetail.num,
            //@ts-ignore
            url: config.chains[chain].explorer.tx.format(txDetail.txHash),
            fee: `${utils.fromValue(txDetail.fee,18).toString(10)} ${txDetail.feeCy}`,
            gasLimit: utils.fromValue(txDetail.gas,0).toString(10),
            gasPrice: `${utils.fromValue(txDetail.gasPrice, 9).toString(10) } GWei`,
        }
    }

    init = async () => {
        const {chain, txHash,blockNum} = this.props;
        const txDetail = await txService.info(chain,txHash,blockNum)
        const txDis = await this._convertToTxDisplay(txDetail)
        this.setState({
            txDetail: txDis
        })
    }

    setShowToast = (f: boolean, msg?: string) => {
        this.setState({
            showToast: f,
            toastMsg: msg
        })
    }
    render() {
        const {txDetail,showToast,toastMsg} = this.state;
        const {chain} = this.props;
        return (
            <IonPage>
                <IonHeader collapse="fade">
                    <IonToolbar>
                        <IonIcon size="large" src={arrowBackOutline} onClick={() => {
                            oRouter.back();
                        }}/>
                        <IonTitle>Transfer Details</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent fullscreen scrollY>
                    <div className="token-tx-head">
                        <div className="token-icon">
                            <IonIcon src={checkmarkCircleOutline} size="large"/> <span className="token-tx-type">{txDetail && txDetail.type}</span>
                        </div>
                        <div className="token-balance">
                            {
                                txDetail && txDetail.amountWithCy.map((v, i) => {
                                    return <div key={i}>
                                        <TokenIcon token={v.token}/>{v.amountDesc}
                                    </div>
                                })
                            }
                        </div>
                        <div>
                            <IonText color="medium">{txDetail && txDetail.time}</IonText>
                        </div>
                    </div>
                    <div>
                        <IonItem>
                            <IonLabel className="ion-text-wrap">
                                <IonRow>
                                    <IonCol size="3">
                                        <div><IonText color="medium">Txn Hash</IonText></div>
                                    </IonCol>
                                    <IonCol size="9">
                                        <div onClick={()=>{
                                            if(utils.isWeb3Chain(chain)){
                                                //@ts-ignore
                                                window.open(config.chains[chain].explorer.tx.format(txDetail.txHash))
                                            }
                                        }}>
                                            <IonText>{txDetail && txDetail.txHash}</IonText>
                                            &nbsp;<IonIcon src={copyOutline} style={{transform: "translateY(2px)"}}  onClick={(e)=>{
                                                e.stopPropagation();
                                            copy(txDetail.txHash)
                                            copy(txDetail.txHash)
                                            this.setShowToast(true,"Copied to clipboard!")
                                        }}/>
                                        </div>
                                    </IonCol>
                                </IonRow>
                            </IonLabel>
                        </IonItem>
                        <IonItem>
                            <IonLabel className="ion-text-wrap">
                                <IonRow>
                                    <IonCol size="3">
                                        <div><IonText color="medium">From</IonText></div>
                                    </IonCol>
                                    <IonCol size="9">
                                        <div onClick={()=>{
                                            if(utils.isWeb3Chain(chain)){
                                                //@ts-ignore
                                                window.open(config.chains[chain].explorer.address.format(txDetail.from))
                                            }
                                        }}>
                                            <IonText>{txDetail && txDetail.from}</IonText>
                                            &nbsp;<IonIcon src={copyOutline} style={{transform: "translateY(2px)"}}  onClick={(e)=>{
                                                e.stopPropagation();
                                                copy(txDetail.from)
                                                copy(txDetail.from)
                                                this.setShowToast(true,"Copied to clipboard!")
                                            }}/>
                                        </div>
                                    </IonCol>
                                </IonRow>
                            </IonLabel>
                        </IonItem>
                        <IonItem>
                            <IonLabel className="ion-text-wrap">
                                <IonRow>
                                    <IonCol size="3">
                                        <div><IonText color="medium">To</IonText></div>
                                    </IonCol>
                                    <IonCol size="9">
                                        {
                                            txDetail && txDetail.to.map((v, i) => {
                                                return <div key={i}  onClick={()=>{
                                                    if(utils.isWeb3Chain(chain)){
                                                        //@ts-ignore
                                                        window.open(config.chains[chain].explorer.address.format(v))
                                                    }
                                                }}>
                                                    <IonText>{v}</IonText>
                                                    &nbsp;<IonIcon src={copyOutline} style={{transform: "translateY(2px)"}}  onClick={(e)=>{
                                                    e.stopPropagation();
                                                    copy(v)
                                                    copy(v)
                                                    this.setShowToast(true,"Copied to clipboard!")
                                                }}/>
                                                </div>
                                            })
                                        }
                                    </IonCol>
                                </IonRow>
                            </IonLabel>
                        </IonItem>
                        <IonItem>
                            <IonLabel className="ion-text-wrap">
                                <IonRow>
                                    <IonCol size="3">
                                        <div><IonText color="medium">Block</IonText></div>
                                    </IonCol>
                                    <IonCol size="9">
                                        <div>{txDetail && <IonBadge>{txDetail.num}</IonBadge>}</div>
                                    </IonCol>
                                </IonRow>
                            </IonLabel>
                        </IonItem>
                        {
                            utils.isWeb3Chain(this.props.chain)
                        }
                    </div>
                    {
                        txDetail &&  utils.isWeb3Chain(this.props.chain) && txDetail.url &&
                        <div className="receive-qr" style={{background: "#fff"}}>
                            <div className="viewa" onClick={() => {
                                window.open(txDetail.url)
                            }}>View the transaction &gt;</div>
                            <div className="qr-1">
                                <div>
                                    <QRCodeSVG value={txDetail.url}
                                               size={100}/>

                                </div>
                            </div>
                        </div>
                    }
                    <IonToast
                        isOpen={showToast}
                        onDidDismiss={() => this.setShowToast(false)}
                        message={toastMsg}
                        duration={1500}
                        position="top"
                        color="primary"
                    />
                </IonContent>
            </IonPage>
        );
    }
}