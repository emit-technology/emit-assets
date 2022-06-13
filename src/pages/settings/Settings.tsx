import * as React from "react";
import {IonPage,IonContent,IonHeader,IonTitle,IonToolbar,IonItemDivider,IonItem,
IonLabel,IonText,IonIcon,IonAvatar} from '@ionic/react';
import {
    browsersOutline,
    chevronForwardOutline,
    helpCircleOutline,
    lockClosedOutline,
    logoFacebook,
    logoReddit,
    logoTwitter,
    logoYoutube,
    paperPlaneOutline,
    personCircle,
    settingsOutline,
    walletOutline,
    arrowForwardOutline,
    alertCircleSharp,
    readerSharp,
    lockClosedSharp,
    settingsSharp,
    helpCircleSharp,
    paperPlaneSharp, logoDiscord
} from "ionicons/icons";

interface Props{
    router: HTMLIonRouterOutletElement | null;
    refresh: number
}

interface State{
}

export class Settings extends React.Component<Props, State> {
    state: State = {};

    componentDidMount() {
        this.init().catch(e => {
            console.error(e)
        })
    }

    componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<any>, snapshot?: any) {
        if (prevProps.refresh != this.props.refresh && window.location.hash.indexOf("#/tab/settings")>-1) {
            this.init().catch(e => {
                console.error(e)
            })
        }
    }

    init = async () => {
    }

    render() {
        return (
            <IonPage>
                <IonHeader collapse="fade">
                    <IonToolbar>
                        <IonTitle>Settings</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent fullscreen scrollY>
                    <IonItemDivider mode="md">Identity</IonItemDivider>
                    <div>
                        <IonItem lines="none">
                            <IonIcon src={personCircle} size="large" slot="start"/>
                            <IonLabel className="ion-text-wrap">
                                @SWS
                            </IonLabel>
                            <IonIcon size="small" src={arrowForwardOutline}/>
                        </IonItem>
                    </div>
                    <IonItemDivider mode="md">General</IonItemDivider>
                    <div>
                        <IonItem lines="none">
                            <IonIcon src={lockClosedSharp} slot="start" size="small"/>
                            <IonLabel className="ion-text-wrap">
                                Safety
                            </IonLabel>
                            <IonIcon size="small" src={chevronForwardOutline}/>
                        </IonItem>
                        <IonItem lines="none">
                            <IonIcon src={browsersOutline} slot="start" size="small"/>
                            <IonLabel className="ion-text-wrap">
                                Push notification
                            </IonLabel>
                            <IonIcon size="small" src={chevronForwardOutline}/>
                        </IonItem>
                        <IonItem lines="none">
                            <IonIcon src={settingsSharp} slot="start" size="small"/>
                            <IonLabel className="ion-text-wrap">
                                Preferences
                            </IonLabel>
                            <IonIcon size="small" src={chevronForwardOutline}/>
                        </IonItem>

                    </div>

                    <IonItemDivider mode="md">Community</IonItemDivider>
                    <div>
                        <IonItem lines="none">
                            <IonIcon src={helpCircleSharp} slot="start" size="small"/>
                            <IonLabel className="ion-text-wrap">
                                Help Center
                            </IonLabel>
                            <IonIcon size="small" src={chevronForwardOutline}/>
                        </IonItem>
                        <IonItem lines="none">
                            <IonIcon src={logoTwitter} slot="start" size="small"/>
                            <IonLabel className="ion-text-wrap">
                                Twitter
                            </IonLabel>
                            <IonIcon size="small" src={chevronForwardOutline}/>
                        </IonItem>
                        <IonItem lines="none">
                            <IonIcon src={paperPlaneSharp} slot="start" size="small"/>
                            <IonLabel className="ion-text-wrap">
                                Telegram
                            </IonLabel>
                            <IonIcon size="small" src={chevronForwardOutline}/>
                        </IonItem>
                        <IonItem lines="none">
                            <IonIcon src={logoFacebook} slot="start" size="small"/>
                            <IonLabel className="ion-text-wrap">
                                Facebook
                            </IonLabel>
                            <IonIcon size="small" src={chevronForwardOutline}/>
                        </IonItem>
                        <IonItem lines="none">
                            <IonIcon src={logoReddit} slot="start" size="small"/>
                            <IonLabel className="ion-text-wrap">
                                Reddit
                            </IonLabel>
                            <IonIcon size="small" src={chevronForwardOutline}/>
                        </IonItem>
                        <IonItem lines="none">
                            <IonIcon src={logoDiscord} slot="start" size="small"/>
                            <IonLabel className="ion-text-wrap">
                               Discord
                            </IonLabel>
                            <IonIcon size="small" src={chevronForwardOutline}/>
                        </IonItem>
                        <IonItem lines="none">
                            <IonIcon src={logoYoutube} slot="start" size="small"/>
                            <IonLabel className="ion-text-wrap">
                                Youtube
                            </IonLabel>
                            <IonIcon size="small" src={chevronForwardOutline}/>
                        </IonItem>
                    </div>

                    <IonItemDivider mode="md">Others</IonItemDivider>
                    <div>
                        <IonItem lines="none">
                            <IonIcon src={readerSharp} slot="start" size="small"/>
                            <IonLabel className="ion-text-wrap">
                                Term of Use
                            </IonLabel>
                            <IonIcon size="small" src={chevronForwardOutline}/>
                        </IonItem>
                        <IonItem lines="none">
                            <IonIcon src={readerSharp} slot="start" size="small"/>
                            <IonLabel className="ion-text-wrap">
                                Service of Policy
                            </IonLabel>
                            <IonIcon size="small" src={chevronForwardOutline}/>
                        </IonItem>
                    </div>
                </IonContent>
            </IonPage>
        );
    }
}