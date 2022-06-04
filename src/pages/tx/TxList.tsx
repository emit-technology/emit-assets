import * as React from 'react';
import {
    IonAvatar,
    IonButton,
    IonCol,
    IonContent,
    IonHeader,
    IonIcon,
    IonItem,
    IonLabel,
    IonPage,
    IonRow,
    IonSegment,
    IonSegmentButton,
    IonTitle,
    IonToolbar
} from '@ionic/react';
import {arrowBackOutline, arrowDownOutline, arrowUpOutline, timeOutline} from "ionicons/icons";
import './index.css';
import {Token, TokenProtocol, TxResp} from "../../types";
import {ChainType} from '@emit-technology/emit-types';
import {oRouter} from "../../common/roter";
import {emitBoxSdk} from "../../service/emit";
import {txService} from "../../service/tx";
import {tokenService} from "../../service/token";
import {NoneData} from "../../components/Data/None";
import {utils} from "../../common/utils";
import config from "../../common/config";

interface Props {
    refresh: number;
    chain: ChainType;
    symbol: string;
    tokenAddress:string
}

interface State {
    txs?: TxResp
    token?: Token
    segment:string
}

export class TxList extends React.Component<Props, State> {

    state: State = {
        segment: "activity"
    }

    componentDidMount() {

        this.init().catch(e => {
            console.error(e)
        })
    }

    init = async () => {
        const {chain, symbol,tokenAddress} = this.props;
        const list = await txService.list(chain, symbol, 0, 10,tokenAddress);
        const token = await tokenService.getTokenBalance(chain, symbol,tokenAddress);
        this.setState({txs: list, token: token})
    }

    render() {
        const {chain, symbol,tokenAddress} = this.props;
        const {txs, token,segment} = this.state;
        return (
            <IonPage>
                <IonHeader collapse="fade">
                    <IonToolbar>
                        <IonIcon size="large" src={arrowBackOutline} onClick={() => {
                            oRouter.back();
                        }}/>
                        <IonTitle>{symbol}</IonTitle>
                        <IonIcon size="large" src={timeOutline} slot="end" style={{paddingRight: "12px"}}/>
                    </IonToolbar>
                </IonHeader>
                <IonContent fullscreen scrollY>
                    <div className="token-tx-head">
                        <div className="token-icon">{
                            token && token.image? <img src={token.image}/>:<div>{token && token.protocol.toUpperCase()}</div>
                        }</div>
                        <div className="token-balance">{token ? utils.fromValue(token.balance,0).toFixed(6,1) : "0.000"}</div>
                    </div>
                    <IonSegment className="segment" mode="md" value={segment} onIonChange={(e)=>{
                        this.setState({segment:e.detail.value})
                    }}>
                        <IonSegmentButton className="seg-btn" mode="md" value="activity">
                            <IonLabel>Activity</IonLabel>
                        </IonSegmentButton>
                        <IonSegmentButton className="seg-btn" mode="md" value="info">
                            <IonLabel>Intro</IonLabel>
                        </IonSegmentButton>
                    </IonSegment>
                    {
                        segment == "activity" &&
                        <div>
                            {
                                txs && txs.data && txs.data.length>0? txs.data.map((v,i) => {
                                    const amount = utils.fromValue(v.amount,token.decimal);
                                    let icon = arrowDownOutline;
                                    let text = "Receive";
                                    let prefix = "+"
                                    if(amount.toNumber()<=0){
                                        icon = arrowUpOutline;
                                        text = "Send"
                                        prefix = ""
                                    }
                                    return <IonItem key={i} onClick={() => {
                                        oRouter.txInfo(chain, v.txHash,v.num)
                                    }}>
                                        <IonAvatar slot="start" className="avatar">
                                            <IonIcon src={icon}/>
                                        </IonAvatar>
                                        <IonLabel>
                                            <div style={{padding: "6px 0"}}>
                                                <span className="token-tx-type">{text}</span>
                                            </div>
                                        </IonLabel>
                                        <IonLabel className="ion-text-wrap" slot="end">
                                            <div className="b-value">{prefix}{amount.toString(10)}</div>
                                            <p>{new Date(v.timestamp*1000).toLocaleString()}</p>
                                        </IonLabel>
                                    </IonItem>
                                }):<NoneData desc="No latest records"/>
                            }
                            <IonItem lines="none"></IonItem>
                            <IonItem lines="none"></IonItem>
                        </div>
                    }
                    {
                        segment == 'info' &&
                            <div>
                                <IonItem>
                                    <IonLabel slot="start" position="fixed">Symbol</IonLabel>
                                    <IonLabel color="medium" className="ion-text-wrap">{token && token.symbol}</IonLabel>
                                </IonItem>
                                <IonItem>
                                    <IonLabel slot="start" position="fixed">Name</IonLabel>
                                    <IonLabel color="medium" className="ion-text-wrap">{token && token.name}</IonLabel>
                                </IonItem>
                                <IonItem>
                                    <IonLabel slot="start" position="fixed">Address</IonLabel>
                                    <IonLabel color="medium" className="ion-text-wrap">{token && token.contractAddress}</IonLabel>
                                </IonItem>
                                <IonItem>
                                    <IonLabel slot="start" position="fixed">Chain</IonLabel>
                                    <IonLabel color="medium" className="ion-text-wrap">{token && config.chains[token.chain].description}</IonLabel>
                                </IonItem>
                                <IonItem>
                                    <IonLabel slot="start" position="fixed">Standard</IonLabel>
                                    <IonLabel color="medium" className="ion-text-wrap">{token && TokenProtocol[token.protocol]}</IonLabel>
                                </IonItem>
                                <IonItem>
                                    <IonLabel slot="start" position="fixed">Decimal</IonLabel>
                                    <IonLabel color="medium" className="ion-text-wrap">{token && token.decimal}</IonLabel>
                                </IonItem>
                                {
                                    token && token.totalSupply &&
                                    <IonItem>
                                        <IonLabel slot="start" position="fixed">Total Supply</IonLabel>
                                        <IonLabel color="medium" className="ion-text-wrap">{token && utils.fromValue(token.totalSupply,token.decimal).toString(0)}</IonLabel>
                                    </IonItem>
                                }
                            </div>
                    }
                    <div className="token-tx-bt">
                        <IonRow>
                            <IonCol><IonButton expand="block" onClick={() => {
                                oRouter.transferToken(chain, symbol,tokenAddress)
                            }}>Send</IonButton></IonCol>
                            <IonCol><IonButton expand="block" onClick={() => {
                                emitBoxSdk.getAccount().then(account => {
                                    oRouter.addressReceive(chain, symbol, account.addresses[chain])
                                })
                            }} fill="outline">Receive</IonButton></IonCol>
                        </IonRow>
                    </div>
                </IonContent>
            </IonPage>
        );
    }
}