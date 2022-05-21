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
import {arrowBackOutline, arrowDownOutline, arrowUpOutline, chevronBackOutline, timeOutline} from "ionicons/icons";
import './index.css';
import {ChainType, Token, Tx, TxResp} from "../../types";
import {oRouter} from "../../common/roter";
import {accountService} from "../../service/emit/account";
import {txService} from "../../service/tx";
import {tokenService} from "../../service/token";
import {NoneData} from "../../components/Data/None";
import {utils} from "../../common/utils";

interface Props {
    refresh: number;
    chain: ChainType;
    symbol: string;
}

interface State {
    txs?: TxResp
    token?: Token
}

export class TxList extends React.Component<Props, State> {

    state: State = {}

    componentDidMount() {

        this.init().catch(e => {
            console.error(e)
        })
    }

    init = async () => {
        const {chain, symbol} = this.props;
        const list = await txService.list(chain, symbol, 0, 10);
        const token = await tokenService.getTokenBalance(chain, symbol);
        this.setState({txs: list, token: token})
    }

    render() {
        const {chain, symbol} = this.props;
        const {txs, token} = this.state;
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
                            token && <img src={token.image}/>
                        }</div>
                        <div className="token-balance">{token ? token.balance : "0.000"}</div>
                    </div>
                    <IonSegment className="segment" mode="md" value="activity">
                        <IonSegmentButton className="seg-btn" mode="md" value="activity">
                            <IonLabel>Activity</IonLabel>
                        </IonSegmentButton>
                        <IonSegmentButton className="seg-btn" mode="md" value="nfts">
                            <IonLabel>Intro</IonLabel>
                        </IonSegmentButton>
                    </IonSegment>
                    <div>
                        {
                            txs && txs.data && txs.data.length>0? txs.data.map((v,i) => {
                                const amount = utils.fromValue(v.amount,token.decimal);
                                let icon = arrowDownOutline;
                                let text = "Receive";
                                let prefix = "+"
                                if(amount.toNumber()<0){
                                    icon = arrowUpOutline;
                                    text = "Send"
                                    prefix = ""
                                }
                                return <IonItem key={i} onClick={() => {
                                    oRouter.txInfo(chain, v.txHash)
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
                    <div className="token-tx-bt">
                        <IonRow>
                            <IonCol><IonButton expand="block" onClick={() => {
                                oRouter.transferToken(chain, symbol)
                            }}>Send</IonButton></IonCol>
                            <IonCol><IonButton expand="block" onClick={() => {
                                accountService.getAccount().then(account => {
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