import * as React from 'react';
import {
    IonButton, IonCard, IonCardTitle, IonCardSubtitle, IonText,
    IonCardContent, IonBadge, IonCardHeader,
    IonRow, IonCol
} from '@ionic/react';
import {utils} from "../../common/utils";
import {CrossBill} from "../../types/cross";
import config from "../../common/config";

interface Props{
    items: Array<CrossBill>
    onReceive:(strp:CrossBill)=>void;
}

export const BillList:React.FC<Props> = ({items,onReceive})=>{
    return (<>
        {
            items.map((v,i)=>{
                return <IonCard key={i}>
                    <IonCardHeader>
                        <IonCardTitle className="balance-span2">
                            <IonRow>
                                <IonCol size="4">
                                    +{utils.fromValue(v.amount,18).toString(10)}&nbsp;
                                </IonCol>
                                <IonCol size="8">
                                    <div style={{textAlign:"right"}}>
                                        <IonBadge>
                                            {v.symbol}&nbsp;
                                            <small style={{fontSize:"35%",letterSpacing:"0"}}>[{utils.ellipsisStr(v.erc20,4)}]</small>
                                        </IonBadge>
                                    </div>
                                </IonCol>
                            </IonRow>
                        </IonCardTitle>
                        <IonCardSubtitle>
                            {utils.dateFormat(new Date(v.timestamp*1000))}
                        </IonCardSubtitle>
                    </IonCardHeader>
                    <IonCardContent>
                        <IonRow>
                            <IonCol size="3">
                                <div className="bk">Cross</div>
                            </IonCol>
                            <IonCol size="5">
                                <div>From: <IonText color="primary"><IonBadge>{config.chains[v.SourceId].description}</IonBadge></IonText> </div>
                                <div>Destination <IonText color="primary"><IonBadge>{config.chains[v.DestinationId].description}</IonBadge></IonText> </div>
                            </IonCol>
                            <IonCol size="4" className="ion-text-right">
                               <IonButton onClick={()=>{
                                   onReceive(v)
                               }}>Receive</IonButton>
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol size="3">
                                <div className="bk">Receipt</div>
                            </IonCol>
                            <IonCol size="7">
                                <div style={{fontSize: '14px'}}>{v.recipient}</div>
                            </IonCol>
                        </IonRow>
                    </IonCardContent>

                </IonCard>
            })
        }

    </>)
}