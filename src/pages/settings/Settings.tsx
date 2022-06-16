import * as React from "react";
import {IonPage,IonContent,IonHeader,IonTitle,IonToolbar,IonItemDivider,IonItem,
IonLabel,IonText,IonIcon,IonAvatar} from '@ionic/react';
import {
    browsersOutline,
    chevronForwardOutline,
    logoFacebook,
    logoReddit,
    logoTwitter,
    readerSharp,
    paperPlaneSharp, globe, logoGithub, logoMedium, languageOutline, logoDiscord, logoYoutube, logoInstagram
} from "ionicons/icons";
interface Props{
    router: HTMLIonRouterOutletElement | null;
    refresh: number
}

interface State{
}
const items = [
    {logo: globe,name: "Website", url: "https://emit.technology", value: "https://emit.technology"},
    {logo: globe,name: "Documents", url: "https://docs.emit.technology", value: "https://docs.emit.technology"},
    {logo: paperPlaneSharp,name: "Telegram", url: "https://t.me/emit_protocol", value: "https://t.me/emit_protocol"},
    {logo: logoGithub,name: "Github", url: "https://github.com/emit-technology", value: "https://github.com/emit-technology"},
    {logo: logoFacebook,name: "Facebook", url: "https://www.facebook.com/EMITProtocolc", value: "https://www.facebook.com/EMITProtocol"},
    {logo: logoTwitter,name: "Twitter", url: "https://twitter.com/emit_protocol", value: "https://twitter.com/emit_protocol"},
    {logo: logoMedium,name: "Medium", url: "https://emitprotocol.medium.com", value: "https://emitprotocol.medium.com"},
    {logo: logoReddit,name: "Reddit", url: "https://www.reddit.com/r/emit_protocol/", value: "https://www.reddit.com/r/emit_protocol/"},
    {logo: logoDiscord,name: "Discord", url: "https://discord.gg/AMFnCJKkZ4", value: "https://https://discord.gg/AMFnCJKkZ4"},
    {logo: logoYoutube,name: "Youtube", url: "https://www.youtube.com/channel/UCKlH9YDE_ackvCbwu8Axu9A", value: "https://www.youtube.com/channel/UCKlH9YDE_ackvCbwu8Axu9A"},
    {logo: logoInstagram,name: "Instagram", url: "https://www.instagram.com/emit_herman/", value: "https://www.instagram.com/emit_herman/"},
]

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
                    <IonItemDivider mode="md">General</IonItemDivider>
                    <div>
                        <IonItem lines="none">
                            <IonIcon src={languageOutline} slot="start" size="small"/>
                            <IonLabel className="ion-text-wrap">
                               Language
                            </IonLabel>
                            <IonIcon size="small" src={chevronForwardOutline}/>
                        </IonItem>

                    </div>

                    <IonItemDivider mode="md">Community</IonItemDivider>
                    <div>
                        {
                            items.map((v,i)=>{
                                return <IonItem lines="none" onClick={()=>{
                                    window.open(v.url)
                                }}>
                                    <IonIcon src={v.logo} slot="start" size="small"/>
                                    <IonLabel className="ion-text-wrap">
                                        {v.name}
                                    </IonLabel>
                                    <IonIcon size="small" src={chevronForwardOutline}/>
                                </IonItem>
                            })
                        }
                    </div>

                    <IonItemDivider mode="md">Others</IonItemDivider>
                    <div>

                        <IonItem lines="none" onClick={()=>{
                            window.open("https://emit.technology/wallet/terms-of-service.html")
                        }}>
                            <IonIcon src={readerSharp} slot="start" size="small"/>
                            <IonLabel className="ion-text-wrap">
                                Term of Use
                            </IonLabel>
                            <IonIcon size="small" src={chevronForwardOutline}/>
                        </IonItem>
                        <IonItem lines="none" onClick={()=>{
                            window.open("https://emit.technology/wallet/privacy-policy.html")
                        }}>
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