import * as React from 'react';
import {
    IonCol,
    IonContent,
    IonHeader,
    IonIcon,
    IonItem,
    IonLabel,IonBadge,
    IonPage,
    IonRow, IonText,
    IonTitle,
    IonToolbar
} from '@ionic/react';
import {
    arrowBackOutline,
    checkmarkCircleOutline,
} from "ionicons/icons";
import './index.css';
import { TxDetail} from "../../types";
import {ChainType} from '@emit-technology/emit-types';
import {oRouter} from "../../common/roter";
import {QRCodeSVG} from 'qrcode.react';
import {utils} from "../../common/utils";
import {tokenService} from "../../service/token";
import config from "../../common/config";
import {emitBoxSdk} from "../../service/emit";
import {txService} from "../../service/tx";

interface Props {
    refresh: number;
    chain: ChainType;
    txHash: string;
    blockNum: null;
}

interface State {
    txDetail?: TxDisplay
}

interface TxDisplay {
    from: string;
    to: Array<string>;
    amountWithCy: Array<string>;
    txHash: string;
    time: string;
    type: string;
    url: string;
    fee: string;
    gasLimit: string;
    gasPrice: string;
    num:number
}

export class TxInfo extends React.Component<Props, State> {

    state: State = {}

    componentDidMount() {
        this.init().catch(e => {
            console.error(e)
        })
    }

    _convertToTxDisplay = async (txDetail: TxDetail): Promise<TxDisplay> => {
        const account = await emitBoxSdk.getAccount();
        const {chain} = this.props;
        let type = "", amount = [];

        const address = account.addresses[chain];
        if (txDetail.records) {
            const records = txDetail.records.filter(v => {
                if (v.address.toLowerCase() == address.toLowerCase()) {
                    return v
                }
            })
            if (records && records.length > 0) {
                for (let record of records) {
                    const token = await tokenService.info(chain, record.currency);
                    const value = utils.fromValue(record.amount, token.decimal);
                    const sym = value.toNumber()>0?"+ ":""
                    amount.push(`${sym}${value.toString(10)} ${record.currency}`)
                    type = value.toNumber() > 0 ? "Receive" : "Sent";
                }
            }
        }
        return {
            from: txDetail.fromAddress,
            to: txDetail.toAddress,
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


    render() {
        const {txDetail} = this.state;
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
                            <IonIcon src={checkmarkCircleOutline} size="large"/>
                        </div>
                        <div><span className="token-tx-type">{txDetail && txDetail.type}</span></div>
                        <div className="token-balance">{
                            txDetail && txDetail.amountWithCy.map((v, i) => {
                                return <div key={i}>{v}</div>
                            })
                        }</div>
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
                                        <div><IonText>{txDetail && txDetail.txHash}</IonText>
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
                                        <div><IonText>{txDetail && txDetail.from}</IonText></div>
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
                                                return <div key={i}>
                                                    <IonText>{v}</IonText>
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
                        <IonItem>
                            <IonLabel className="ion-text-wrap">
                                <IonRow>
                                    <IonCol size="3">
                                        <div><IonText color="medium">Fee</IonText></div>
                                    </IonCol>
                                    <IonCol size="9">
                                        <div><IonText>{txDetail && txDetail.fee}</IonText></div>
                                        <IonText color="medium">
                                            <div>({txDetail && txDetail.gasPrice} * {txDetail && txDetail.gasLimit})</div>
                                        </IonText>
                                    </IonCol>
                                </IonRow>
                            </IonLabel>
                        </IonItem>
                    </div>
                    {
                        txDetail && txDetail.url &&
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
                </IonContent>
            </IonPage>
        );
    }
}