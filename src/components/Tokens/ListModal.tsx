import * as React from 'react';
import {Token} from "../../types";
import {
    IonAvatar,
    IonContent,
    IonToggle,
    IonItem,
    IonLabel,
    IonPage,
    IonRadio,
    IonSearchbar,
    IonToolbar, IonButtons, IonButton, IonIcon, IonTitle, IonHeader
} from "@ionic/react";
import {arrowBackOutline, closeOutline, linkOutline, optionsOutline, scanCircleOutline} from "ionicons/icons";
import {TokenList} from "./List";
import {ItemReorderEventDetail} from "@ionic/core";

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

export const TokenListModal: React.FC<Props> = ({tokens,onSelect, onSend,
                                               onHide,doReorder,onReceive,title, onClose}) => {

    const [option,setOption] = React.useState(false);
    return (
        <IonPage>
            <IonHeader mode="ios" collapse="fade">
                <IonToolbar>
                    <IonTitle className="ion-text-center">{title}</IonTitle>
                    <IonButtons slot="start">
                        <IonIcon src={arrowBackOutline} size="large" onClick={() => {
                            onClose()
                        }}/>
                    </IonButtons>
                    {
                        onHide &&
                        <IonButtons slot="end">
                            {option?<IonButton onClick={()=>{
                                    setOption(false)
                                }}>Complete</IonButton>:
                                <IonIcon src={optionsOutline} size="large" onClick={() => {
                                    setOption(true)
                                }}/>
                            }
                        </IonButtons>
                    }
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen scrollY>
                <TokenList tokens={tokens} doReorder={option?doReorder:undefined} onSend={onSend} onHide={onHide} onReceive={onReceive} onClose={onClose} onSelect={onSelect}/>
            </IonContent>
        </IonPage>
    );
}