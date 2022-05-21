import * as React from 'react';
import {Token} from "../../types/token";
import {
    IonAvatar,
    IonContent,IonReorder,
    IonToggle, IonText,
    IonItem,
    IonLabel,
    IonPage,
    IonRadio,
    IonSearchbar,
    IonToolbar, IonButtons, IonButton, IonIcon, IonTitle, IonHeader, IonReorderGroup
} from "@ionic/react";
import { ItemReorderEventDetail } from '@ionic/core';
import {
    closeOutline,
    linkOutline,
    menuOutline,
    pizzaOutline,
    reorderThreeOutline,
    scanCircleOutline
} from "ionicons/icons";
import {tokenService} from "../../service/token";
import {utils} from "../../common/utils";

interface Props {
    tokens: Array<Token>;
    onSend?: (token: Token) => void;
    onReceive?: (token: Token) => void;
    onHide?: (hide:boolean,token: Token) => void;
    onSelect?: (token: Token) => void;
    title?: string;
    onClose?: () => void;

    doReorder?: (event: CustomEvent<ItemReorderEventDetail>)=>void;

}

export const TokenList: React.FC<Props> = ({tokens,doReorder,onSelect, onSend,
                                               onHide,onReceive,title, onClose}) => {

    return (
        <>
            <IonReorderGroup disabled={!onHide} onIonItemReorder={doReorder}>
            {
                tokens.map((v, i) => {
                    const isHide = tokenService.isHide(v)
                    return <IonItem key={i} className="lines" onClick={()=>{
                        if(onReceive){
                            onReceive(v);
                        }else if(onSend){
                            onSend(v);
                        }else if(onSelect){
                            onSelect(v)
                        }
                    }}>
                        <IonAvatar className="avatar" slot="start">
                            {v.image ? <img src={v.image}/> : <div>{v.protocol.toUpperCase()}</div>}
                        </IonAvatar>
                        <IonLabel className="ion-text-wrap">
                            <div style={{fontWeight: 700}}>{v.name}</div>
                            <p>{v.protocol.toUpperCase()}</p>
                        </IonLabel>
                        {
                            onHide ?(doReorder?
                                <IonReorder slot="end">
                                <IonIcon icon={reorderThreeOutline} size="large" color="medium" />
                            </IonReorder>:<IonToggle slot="end" checked={!isHide} onIonChange={(e)=>{
                               onHide(!e.detail.checked,v)
                            }}/>) :
                                <IonLabel slot="end" className="ion-text-wrap ion-text-right">
                                    <div className="b-value">{v.balance?utils.nFormatter(v.balance,3):"0.000"}</div>
                                    <div>
                                        <IonText color="medium">
                                            {v.symbol}
                                        </IonText>
                                    </div>
                                </IonLabel>
                        }

                    </IonItem>
                })
            }
            </IonReorderGroup>
        </>
    );
}