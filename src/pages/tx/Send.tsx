import * as React from 'react';
import {
    IonPage,
    IonContent,
    IonHeader,
    IonButton,
    IonText,
    IonTitle,
    IonInput,
    IonRow,
    IonCol,
    IonToolbar,
    IonItem,
    IonLabel,
    IonTextarea,
    IonIcon
} from '@ionic/react';
import {ChainType, Token} from "../../types";
import {arrowBackOutline, chevronForwardOutline} from "ionicons/icons";
import './index.css';
import {oRouter} from "../../common/roter";
import {tokenService} from "../../service/token";
import {gasService} from "../../service/gas";
import {accountService} from "../../service/emit/account";
import {utils} from "../../common/utils";

interface Props {
    refresh: number;
    chain: ChainType;
    symbol: string;
}

interface State {
    token?: Token
    receive?: string
    amount?: string
}

export class SendPage extends React.Component<Props, State> {

    state: State = {}

    componentDidMount() {
        this.init().catch(e => {
            console.error(e)
        })
    }

    init = async () => {
        const {chain, symbol} = this.props;
        const token = await tokenService.getTokenBalance(chain, symbol);
        this.setState({token: token})
    }

    nextConfirm = async () => {
        const {chain, symbol} = this.props;
        const {receive, amount, token} = this.state;
        const ret = await accountService.web3Send(chain, receive, utils.toHex(utils.toValue(amount, token.decimal)))
        console.log(ret)
    }

    render() {
        const {chain, symbol} = this.props;
        const {token} = this.state;
        return (
            <IonPage>
                <IonHeader collapse="fade">
                    <IonToolbar>
                        <IonIcon src={arrowBackOutline} size="large" onClick={() => {
                            oRouter.back()
                        }}/>
                        <IonTitle>Transfer</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent fullscreen scrollY>
                    <div style={{padding: "12px 20px"}}>
                        <h1>Send {symbol}</h1>
                    </div>
                    <IonItem lines="none">
                        <IonLabel position="stacked">Address</IonLabel>
                        <IonTextarea autoGrow clearOnEdit color="primary" onIonChange={(e) => {
                            //TODO validation
                            this.setState({
                                receive: e.detail.value
                            })
                        }} autofocus className="input-addr"/>
                    </IonItem>
                    <IonItem lines="none">
                        <IonLabel position="stacked">
                            <IonRow>
                                <IonCol size="4">Transfer amount</IonCol>
                                <IonCol size="6"><span className="balance-span"><IonText
                                    color="medium">Available {token && utils.nFormatter(token.balance,4)} {token && token.symbol}</IonText></span></IonCol>
                                <IonCol size="2"><span className="btn-max">MAX</span></IonCol>
                            </IonRow>
                        </IonLabel>
                        <div className="input-d1">
                            <IonInput clearOnEdit color="primary" onIonChange={(e) => {
                                this.setState({
                                    amount: e.detail.value
                                })
                            }} className="input-amt" inputMode="decimal"/>
                            <div className="input-d2">{token && token.symbol}</div>
                        </div>
                    </IonItem>
                    <IonItem lines="none" detail detailIcon={chevronForwardOutline}>
                        <IonLabel>Fee</IonLabel>
                        <IonLabel className="ion-text-wrap" slot="end">
                            <IonText color="medium">{gasService.defaultGas(chain)} {token && token.symbol}</IonText>
                        </IonLabel>
                    </IonItem>
                    <div style={{padding: "48px 12px"}}>
                        <IonButton expand="block" onClick={() => {

                            accountService.ethWeb3.eth.getAccounts((e,act)=>{
                                console.log(e,act)
                                this.nextConfirm().catch(e=>{
                                    console.error(e)
                                })
                            })

                        }}>Next step</IonButton>
                    </div>
                </IonContent>
            </IonPage>
        );
    }
}