import * as React from 'react';
import {
    IonContent,
    IonHeader,
    IonLabel,
    IonLoading,
    IonPage,
    IonSearchbar,
    IonSegment,
    IonSegmentButton,
    IonTitle, IonToast,
    IonToolbar
} from "@ionic/react";
import {InboxList} from "../../components/Inbox/List";
import './index.css';
import {emitBoxSdk} from "../../service/emit";
import {AccountModel,ChainType} from '@emit-technology/emit-types';
import {FactorSet, Settle, SettleResp} from "@emit-technology/emit-account-node-sdk";
import {CrossBill} from "../../types/cross";
import {crossBillService} from "../../service/cross/bill";
import {BillList} from "../../components/Inbox/BillList";
import {oRouter} from "../../common/roter";

interface Props {
    router: HTMLIonRouterOutletElement | null;
    refresh: number
}

interface State {
    settles: Array<SettleResp>
    showLoading: boolean,
    bills: Array<CrossBill>,
    segment: string
    showToast:boolean,
    toastMsg:string
}

export class InboxPage extends React.Component<Props, State> {
    state: State = {
        settles: [],
        showLoading: false,
        bills: [],
        segment: "settles",
        showToast:false,
        toastMsg:""
    };

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
        const account = await emitBoxSdk.getAccount();
        const settles = await emitBoxSdk.emitBox.emitDataNode.getSettles(account.addresses[ChainType.EMIT]);
        const bills = await crossBillService.list(ChainType.BSC);
        this.setState({
            settles: settles,
            bills: bills
        })
    }

    onReceive = async (settles: Array<SettleResp>) => {
        const account = await emitBoxSdk.getAccount();
        const sets: Array<Settle> = [];
        for (let settle of settles) {
            sets.push({
                from: settle.from_index_key.from,
                index: settle.from_index_key.index,
                num: settle.from_index_key.num,
                factor: settle.factor.factor,
            });
        }
        const factorSet: FactorSet = {
            settles: sets,
            outs: [],
        };
        const data = await emitBoxSdk.emitBox.emitDataNode.genPrepareBlock(
            account.addresses[ChainType.EMIT],
            [],
            factorSet,
            ""
        );
        // const sig = await accountService.emitBox.batchSignMsg([
        //     {chain:ChainType.EMIT,msg:data}
        // ])
        // console.log("debug:",sig)
        await emitBoxSdk.emitBox.emitDataNode.prepareBlock(data);

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                this.init().then(() => {
                    resolve(true)
                }).catch(e => {
                    reject(e)
                    console.error(e)
                })
            }, 3 * 1000)
        })
    }

    setShowLoading = (f: boolean) => {
        this.setState({
            showLoading: f
        })
    }

    onVote = async (bill: CrossBill) => {
        const rest = await crossBillService.commitVote(bill);
        oRouter.txInfo(rest.chain,rest.transactionHash,0)
    }

    setShowToast = (f:boolean,msg?:string)=>{
        this.setState({
            showToast:f,
            toastMsg:msg
        })
    }
    render() {
        const {settles, showLoading, segment, bills,showToast,toastMsg} = this.state;
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
                        <IonSegment className="segment" value={segment} mode="md" onIonChange={e => {
                            this.setState({segment: e.detail.value});
                            this.init().catch(e=>console.error(e))
                        }}>
                            <IonSegmentButton className="seg-btn" mode="md" value="settles">
                                <IonLabel>Settles</IonLabel>
                            </IonSegmentButton>
                            <IonSegmentButton className="seg-btn" mode="md" value="bills">
                                <IonLabel>Bills</IonLabel>
                            </IonSegmentButton>
                        </IonSegment>
                    </div>
                    {
                        segment == 'settles' &&
                        <InboxList items={settles} onReceive={(v) => {
                            this.setShowLoading(true)
                            this.onReceive(v).then(() => {
                                this.setShowLoading(false)
                            }).catch(e => {
                                this.setShowLoading(false)
                                const err = typeof e == 'string'?e:e.message;
                                this.setShowToast(true,err)
                                console.error(e)
                            });
                        }}/>
                    }
                    {
                        segment == 'bills' &&
                        <BillList items={bills} onReceive={(v) => {
                            this.setShowLoading(true)
                            this.onVote(v).then(()=>{
                                this.setShowLoading(false)
                            }).catch(e=>{
                                const err = typeof e == 'string'?e:e.message;
                                this.setShowToast(true,err)
                                this.setShowLoading(false)
                                console.error(e)
                            })
                        }
                        }/>
                    }
                    <IonLoading
                        cssClass='my-custom-class'
                        isOpen={showLoading}
                        onDidDismiss={() => this.setShowLoading(false)}
                        message={'Pending...'}
                        duration={60 * 1000}
                    />
                    <IonToast
                        isOpen={showToast}
                        onDidDismiss={() => this.setShowToast(false)}
                        message={toastMsg}
                        duration={1500}
                        position="top"
                        color="primary"
                    />
                </IonContent>
            </IonPage>
        );
    }
}