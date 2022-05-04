import * as React from 'react';
import {
    IonSearchbar,
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar, IonSegment, IonSegmentButton, IonLabel
} from "@ionic/react";
import {InboxList} from "../../components/Inbox/List";
import './index.css';

interface Props{
    router: HTMLIonRouterOutletElement | null;
    refresh: number
}

interface State{
}
export class InboxPage extends React.Component<Props, State>{
    state:State = {};

    componentDidMount() {
        this.init().catch(e => {
            console.error(e)
        })
    }

    componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<any>, snapshot?: any) {
        if (prevProps.refresh != this.props.refresh) {
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
                <IonHeader mode="ios" collapse="fade">
                    <IonToolbar>
                        <IonTitle className="ion-text-center">
                           Inbox
                        </IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent fullscreen>
                    <IonSearchbar></IonSearchbar>
                    <div style={{position: 'sticky', top: 0, background: "#fff", zIndex: "1000"}}>
                        <IonSegment className="segment" mode="md" value="all" onIonChange={e => { }}>
                            <IonSegmentButton className="seg-btn" mode="md" value="all">
                                <IonLabel>All</IonLabel>
                            </IonSegmentButton>
                            <IonSegmentButton className="seg-btn" mode="md" value="unReceive">
                                <IonLabel>UnReceive</IonLabel>
                            </IonSegmentButton>
                            <IonSegmentButton className="seg-btn" mode="md" value="Received">
                                <IonLabel>Received</IonLabel>
                            </IonSegmentButton>
                        </IonSegment>
                    </div>
                   <InboxList items={[1,2,3,3,4,5,6,7,8,9]}/>
                </IonContent>
            </IonPage>
        );
    }
}