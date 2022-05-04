import * as React from 'react';
import {Token} from "../../types/token";
import {
    IonAvatar,
    IonContent,
    IonToggle,IonText,
    IonItem,
    IonLabel,
    IonPage,
    IonRadio,
    IonSearchbar,
    IonToolbar, IonButtons, IonButton, IonIcon, IonTitle, IonHeader
} from "@ionic/react";
import {closeOutline, linkOutline, scanCircleOutline} from "ionicons/icons";

interface Props {
    tokens: Array<Token>;
    onSend?: (token: Token) => void;
    onReceive?: (token: Token) => void;
    onAdd?: (token: Token) => void;
    onSelect?: (token: Token) => void;
    title?: string;
    onClose?: () => void;
}

export const TokenList: React.FC<Props> = ({tokens,onSelect, onSend,
                                               onAdd,onReceive,title, onClose}) => {

    return (
        <>
            {
                tokens.map((v, i) => {
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
                            onAdd ? <IonToggle></IonToggle> :
                                <IonLabel slot="end" className="ion-text-wrap ion-text-right">
                                    <div className="b-value">10000000.0000</div>
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
        </>
    );
}