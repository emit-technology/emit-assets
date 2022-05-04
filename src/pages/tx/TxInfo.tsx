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
    IonRow,IonText,
    IonSegment,
    IonSegmentButton,
    IonTitle,
    IonToolbar
} from '@ionic/react';
import {
    arrowBackOutline,
    arrowDownOutline,
    arrowUpOutline,
    checkmarkCircle, checkmarkCircleOutline,
    checkmarkOutline,
    chevronBackOutline,
    timeOutline
} from "ionicons/icons";
import './index.css';
import {ChainType} from "../../types";
import {oRouter} from "../../common/roter";
import {QRCodeSVG} from 'qrcode.react';

interface Props {
    refresh: number;
    chain: ChainType;
    txHash: string;
}

export class TxInfo extends React.Component<Props, any> {

    render() {
        return (
            <IonPage>
                <IonHeader collapse="fade">
                    <IonToolbar>
                        <IonIcon size="large" src={arrowBackOutline} onClick={()=>{
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
                        <div><span className="token-tx-type">Sent</span></div>
                        <div className="token-balance">-1 BSC-USD</div>
                    </div>
                    <div>
                        <IonItem>
                            <IonLabel className="ion-text-wrap">
                                <IonRow>
                                    <IonCol size="3">
                                        <div><IonText color="medium">Txn Hash</IonText></div>
                                    </IonCol>
                                    <IonCol size="9">
                                        <div><IonText></IonText>0xfc65447b53336f23f492f6eb00bb00a66f7ed1a7bec4f41435d5f2a13427a364</div>
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
                                        <div><IonText></IonText>0x3f349bbafec1551819b8be1efea2fc46ca749aa1</div>
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
                                        <div><IonText></IonText>0x3f349bbafec1551819b8be1efea2fc46ca749aa1</div>
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
                                        <div><IonText></IonText>0.0000138512 ETH</div>
                                    </IonCol>
                                </IonRow>
                            </IonLabel>
                        </IonItem>
                    </div>
                    <div className="receive-qr" style={{background:"#fff"}}>
                        <div className="viewa" onClick={()=>{
                            window.open("https://bscscan.com")
                        }}>View the transaction &gt;</div>
                        <div className="qr-1">
                            <div>
                                <QRCodeSVG value={"0xfc65447b53336f23f492f6eb00bb00a66f7ed1a7bec4f41435d5f2a13427a364"} size={100} />
                            </div>
                        </div>
                    </div>
                </IonContent>
            </IonPage>
        );
    }
}