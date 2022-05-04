import * as React from 'react';
import {Token} from "../../types/token";
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
import {closeOutline, linkOutline, scanCircleOutline} from "ionicons/icons";
import {TokenList} from "./List";

interface Props {
    tokens: Array<Token>;
    onSend?: (token: Token) => void;
    onReceive?: (token: Token) => void;
    onAdd?: (token: Token) => void;
    onSelect?: (token: Token) => void;
    title?: string;
    onClose?: () => void;
}

export const TokenListModal: React.FC<Props> = ({tokens,onSelect, onSend,
                                               onAdd,onReceive,title, onClose}) => {

    return (
        <IonPage>
            <IonHeader mode="ios" collapse="fade">
                <IonToolbar>
                    <IonTitle className="ion-text-center">{title}</IonTitle>
                    <IonButtons slot="end">
                        <IonIcon src={closeOutline} size="large" onClick={() => {
                            onClose()
                        }}/>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen scrollY>
                <IonSearchbar value={""} placeholder="Search Tokens"></IonSearchbar>
                <TokenList tokens={tokens} onSend={onSend} onAdd={onAdd} onReceive={onReceive} onClose={onClose} onSelect={onSelect}/>
            </IonContent>
        </IonPage>
    );
}