import * as React from 'react';
import {IonPage, IonContent, IonIcon, IonHeader, IonToolbar,IonText, IonTitle,IonRow,IonCol} from '@ionic/react';
import {arrowBackOutline, copyOutline, shareOutline} from "ionicons/icons";
import './index.css';
import {QRCodeSVG} from 'qrcode.react';
import {oRouter} from "../../common/roter";
import {ChainType} from "../../types";

interface Props {
    refresh: number;
    chain:ChainType;
    address:string;
    token:string;
}

export class Receive extends React.Component<Props, any> {

    render() {
        const {chain,address,token} = this.props;
        return (
            <IonPage>
                <IonHeader collapse="fade">
                    <IonToolbar>
                        <IonIcon src={arrowBackOutline} size="large" onClick={()=>oRouter.back()}/>
                        <IonTitle>Receive {token}</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent fullscreen scrollY>
                    <div className="receive-qr">
                        <div>Scan the address QR code to transfer</div>
                        <div className="qr-1">
                            <div>
                                <QRCodeSVG value={address} size={200} />
                            </div>
                        </div>
                    </div>
                    <div className="ion-text-center" style={{padding:"0 24px"}}>
                        <p><small><IonText color="medium">Receiving Address</IonText></small></p>
                        <p><b><IonText color="medium">{address}</IonText></b></p>
                    </div>
                    <div className="qr-btn">
                        <p><IonText color="medium"><IonIcon src={copyOutline} style={{transform: "translateY(3px)"}} /> Copy</IonText></p>
                    </div>
                </IonContent>
            </IonPage>
        );
    }
}
