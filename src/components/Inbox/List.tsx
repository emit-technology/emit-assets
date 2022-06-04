import * as React from 'react';
import {
    IonLabel, IonItemDivider, IonItem, IonChip, IonButton, IonCard, IonCardTitle, IonCardSubtitle, IonText,
    IonAvatar, IonCardContent, IonBadge, IonCardHeader,
    IonRow, IonCol, IonSegment, IonSegmentButton
} from '@ionic/react';
import {SettleResp} from "@emit-technology/emit-account-node-sdk";
import {utils} from "../../common/utils";

interface Props{
    items: Array<SettleResp>
    onReceive:(strp:Array<SettleResp>)=>void;
}

export const InboxList:React.FC<Props> = ({items,onReceive})=>{
    return (<>
        {
            items.map((v,i)=>{
                return <IonCard key={i}>
                    <IonCardHeader>
                        <IonCardTitle className="balance-span2">
                            <IonRow>
                                <IonCol size="4">
                                    +{utils.fromHexValue(v.factor.factor.value).toString(10)}&nbsp;
                                </IonCol>
                                <IonCol size="8">
                                    <div style={{textAlign:"right"}}>
                                        <IonBadge>
                                            {utils.formatCategoryString(v.factor.factor.category)}&nbsp;
                                            <small style={{fontSize:"35%",letterSpacing:"0"}}>[{utils.ellipsisStr(v.factor.factor.category.field,4)}]</small>
                                        </IonBadge>
                                    </div>
                                </IonCol>
                            </IonRow>
                        </IonCardTitle>
                        <IonCardSubtitle>
                            {utils.dateFormat(new Date(v.factor.timestamp*1000))}
                        </IonCardSubtitle>
                    </IonCardHeader>
                    <IonCardContent>
                        <IonRow>
                            <IonCol size="2">
                                <div className="bk">Bk</div>
                            </IonCol>
                            <IonCol size="5">
                                <div><IonText color="primary"><IonBadge>{v.from_index_key.num}</IonBadge></IonText> </div>
                                <div>Index <IonText color="primary">{v.from_index_key.index}</IonText></div>
                            </IonCol>
                            <IonCol size="5" className="ion-text-right">
                                {
                                    v.settled?<IonBadge color="success">SETTLED</IonBadge>:
                                        <IonButton expand="block" size="small" onClick={()=>{
                                            onReceive([v])
                                        }}>Receive</IonButton>
                                }
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol size="2">
                                <div className="bk">Fm</div>
                            </IonCol>
                            <IonCol size="10">
                                <div style={{fontSize: '14px'}}>{v.from_index_key.from}</div>
                            </IonCol>
                        </IonRow>
                    </IonCardContent>

                </IonCard>
            })
        }

    </>)
}