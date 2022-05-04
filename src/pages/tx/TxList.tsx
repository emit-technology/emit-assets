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
import {ChainType} from "../../types";
import {oRouter} from "../../common/roter";

interface Props {
    refresh: number;
    chain: ChainType;
    symbol: string;
}

export class TxList extends React.Component<Props, any> {
    render() {
        return (
            <IonPage>
                <IonHeader collapse="fade">
                    <IonToolbar>
                        <IonIcon size="large" src={arrowBackOutline} onClick={()=>{
                            oRouter.back();
                        }}/>
                        <IonTitle>USDT</IonTitle>
                        <IonIcon size="large" src={timeOutline} slot="end" style={{paddingRight: "12px"}}/>
                    </IonToolbar>
                </IonHeader>
                <IonContent fullscreen scrollY>
                    <div className="token-tx-head">
                        <div className="token-icon"><img src="./assets/img/tokens/bitcoin.png"/></div>
                        <div className="token-balance">219.6494809</div>
                    </div>
                    <IonSegment className="segment" mode="md" value="activity" >
                        <IonSegmentButton className="seg-btn" mode="md" value="activity">
                            <IonLabel>Activity</IonLabel>
                        </IonSegmentButton>
                        <IonSegmentButton className="seg-btn" mode="md" value="nfts">
                            <IonLabel>Intro</IonLabel>
                        </IonSegmentButton>
                    </IonSegment>
                    <div>
                        {
                            [1,2,3,4,5,6,7,8,9].map(v=>{
                                return <>
                                    <IonItem onClick={()=>{
                                        oRouter.txInfo(ChainType.BSC, "11")
                                    }}>
                                        <IonAvatar slot="start" className="avatar">
                                            <IonIcon src={arrowUpOutline}/>
                                        </IonAvatar>
                                        <IonLabel><span className="token-tx-type">Sent</span></IonLabel>
                                        <IonLabel className="ion-text-wrap" slot="end">
                                            <div className="b-value">-1</div>
                                            <p>{new Date().toLocaleString()}</p>
                                        </IonLabel>
                                    </IonItem>
                                    <IonItem>
                                        <IonAvatar slot="start" className="avatar">
                                            <IonIcon src={arrowDownOutline}/>
                                        </IonAvatar>
                                        <IonLabel><span className="token-tx-type">Receive</span></IonLabel>
                                        <IonLabel className="ion-text-wrap" slot="end">
                                            <div className="b-value">+ 599.2</div>
                                            <p>{new Date().toLocaleString()}</p>
                                        </IonLabel>
                                    </IonItem>
                                </>
                            })
                        }
                        <IonItem lines="none"></IonItem>
                        <IonItem lines="none"></IonItem>
                    </div>
                    <div className="token-tx-bt">
                        <IonRow>
                            <IonCol><IonButton expand="block" onClick={()=>{
                                oRouter.transferToken(ChainType.BSC, "USDT")
                            }}>Send</IonButton></IonCol>
                            <IonCol><IonButton expand="block" onClick={()=>{
                                oRouter.addressReceive(ChainType.BSC, "USDT")
                            }} fill="outline">Receive</IonButton></IonCol>
                        </IonRow>
                    </div>
                </IonContent>
            </IonPage>
        );
    }
}