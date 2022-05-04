import * as React from 'react';
import {
    IonLabel, IonItemDivider, IonItem, IonChip, IonButton, IonCard, IonCardTitle, IonCardSubtitle, IonText,
    IonAvatar, IonCardContent, IonBadge, IonCardHeader,
    IonRow, IonCol, IonSegment, IonSegmentButton
} from '@ionic/react';
import {Inbox} from "../../types";

interface Props{
    items: Array<any>
}

export const InboxList:React.FC<Props> = ({items})=>{
    return (<>
        {
            items.map((v,i)=>{
                return <IonCard>
                    <IonCardHeader>
                        <IonCardTitle className="balance-span2">10000.000 <small>EASTER</small></IonCardTitle>
                        <IonCardSubtitle>
                            12:57:12 2021/8/16
                        </IonCardSubtitle>
                    </IonCardHeader>
                    <IonCardContent>
                        <IonRow>
                            <IonCol size="2">
                                <div className="bk">Bk</div>
                            </IonCol>
                            <IonCol size="5">
                                <div><IonText color="primary"><IonBadge>1234</IonBadge></IonText> </div>
                                <div>Index <IonText color="primary">1</IonText></div>
                            </IonCol>
                            <IonCol size="5" className="ion-text-right">
                                <IonChip>EMIT CORE</IonChip>
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol size="2">
                                <div className="bk">Fm</div>
                            </IonCol>
                            <IonCol size="10">
                                <div style={{fontSize: '14px'}}>EXWRht9orgUVs2PD1AWRQbRaNcUaAdynC8H4nXeVFaSWzi7fp</div>
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol size="8"></IonCol>
                            <IonCol size="4">
                                <IonButton expand="block" size="small">Receive</IonButton>
                            </IonCol>
                        </IonRow>
                    </IonCardContent>

                </IonCard>
            })
        }

    </>)
}