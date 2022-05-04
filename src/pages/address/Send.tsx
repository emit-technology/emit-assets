import * as React from 'react';
import {IonPage, IonContent, IonHeader,IonChip,IonButton, IonText,IonTitle,IonInput,IonRow,IonCol,IonItemDivider, IonToolbar,IonItem,IonLabel,IonTextarea, IonIcon} from '@ionic/react';
import {ChainType} from "../../types";
import {arrowBackOutline, chevronBackOutline, chevronForwardOutline} from "ionicons/icons";
import './index.css';
import {oRouter} from "../../common/roter";
import {accountService} from "../../data/emit/account";

interface Props {
    refresh: number;
    chain: ChainType;
    symbol: string;
}

export class SendPage extends React.Component<Props, any> {

    render() {
        return (
            <IonPage>
                <IonHeader collapse="fade">
                    <IonToolbar>
                        <IonIcon src={arrowBackOutline} size="large" onClick={()=>{
                            oRouter.back()
                        }}/>
                        <IonTitle>Transfer</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent fullscreen scrollY>
                    <div style={{padding:"12px 20px"}}>
                        <h1>Send BNB</h1>
                    </div>
                    <IonItem lines="none">
                        <IonLabel position="stacked">Address</IonLabel>
                        <IonTextarea autoGrow clearOnEdit color="primary" autofocus className="input-addr"/>
                    </IonItem>
                    <IonItem lines="none">
                        <IonLabel position="stacked">
                            <IonRow>
                                <IonCol size="4">Transfer amount</IonCol>
                                <IonCol size="6"><span className="balance-span"><IonText color="medium">Available 0.0111111 BNB</IonText></span></IonCol>
                                <IonCol size="2"><span className="btn-max">MAX</span></IonCol>
                            </IonRow>
                        </IonLabel>
                        <div className="input-d1">
                            <IonInput clearOnEdit color="primary" className="input-amt" inputMode="decimal"/>
                            <div className="input-d2">BNB</div>
                        </div>
                    </IonItem>
                    <IonItem lines="none" detail detailIcon={chevronForwardOutline}>
                        <IonLabel>Fee</IonLabel>
                        <IonLabel className="ion-text-wrap" slot="end">
                            <IonText color="medium">0.00000104 BNB</IonText>
                        </IonLabel>
                    </IonItem>
                    <div style={{padding:"48px 12px"}}>
                        <IonButton expand="block" onClick={()=>{
                            accountService.signTx()
                        }}>Next step</IonButton>
                    </div>
                </IonContent>
            </IonPage>
        );
    }
}