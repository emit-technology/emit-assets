import * as React from 'react';
import {
    IonCol,
    IonContent,
    IonHeader,
    IonIcon,
    IonItem,
    IonLabel,
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
import {ChainType, TxDetail} from "../../types";
import {oRouter} from "../../common/roter";
import {QRCodeSVG} from 'qrcode.react';
import rpc from "../../rpc";
import {utils} from "../../common/utils";
import {tokenService} from "../../service/token";
import config from "../../common/config";
import {accountService} from "../../service/emit/account";

interface Props {
    refresh: number;
    chain: ChainType;
    txHash: string;
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
}

export class TxInfo extends React.Component<Props, State> {

    state: State = {}

    componentDidMount() {
        this.init().catch(e => {
            console.error(e)
        })
    }

    _convertToTxDisplay = async (txDetail: TxDetail): Promise<TxDisplay> => {
        const account = await accountService.getAccount();
        const {chain} = this.props;
        let type = "", amount = [];

        const address = account.addresses[chain];
        if (txDetail.records) {
            const records = txDetail.records.filter(v => {
                if (v.address.toLowerCase() == address.toLowerCase()) {
                    return v
                }
            })
            console.log(records)
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
            //@ts-ignore
            url: config.exploreUrl.tx[chain].format(txDetail.txHash),
            fee: `${utils.fromValue(txDetail.fee,18).toString(10)} ${txDetail.feeCy}`,
            gasLimit: utils.fromValue(txDetail.gas,0).toString(10),
            gasPrice: `${utils.fromValue(txDetail.gasPrice, 9).toString(10) } GWei`,
        }
    }

    init = async () => {
        const {chain, txHash} = this.props;
        const txDetail = await rpc.getTxInfo(chain, txHash)
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