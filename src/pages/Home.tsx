import * as React from 'react';
import {
    IonAvatar,
    IonButton,
    IonButtons,
    IonCol,
    IonContent,
    IonHeader,
    IonIcon,
    IonLabel,
    IonModal,
    IonPage,
    IonRow,
    IonSegment,IonText,
    IonSegmentButton,
    IonTitle,
    IonToolbar
} from '@ionic/react';
import './Home.css';
import {ChainType} from "../types";
import {
    addCircleOutline,
    arrowDownCircleOutline,
    arrowUpCircleOutline,
    linkOutline,
    scanCircleOutline
} from "ionicons/icons";
import {NftList} from "../components/Nft/List";
import {oRouter} from "../common/roter";
import {nftService} from "../data/nft";
import {NftStandard,Token} from "../types";
import {TokenList} from "../components/Tokens/List";
import {tokenService} from "../data/token";
import {TokenListModal} from "../components/Tokens/ListModal";
import {accountService} from "../data/emit/account";
import {utils} from "../common/utils";

interface Props {
    router: HTMLIonRouterOutletElement | null;
    refresh: number
}

interface State {
    nftData: Array<NftStandard>;
    tab: string;
    showModal: boolean;
    tokens: Array<Token>;
    modal: string;
    account:string;
}

export class Home extends React.Component<Props, State> {

    state: State = {
        tab: "tokens",
        nftData: [],
        showModal: false,
        tokens: [],
        modal: "",
        account: ""
    }

    setTab = (v: string) => {
        this.setState({
            tab: v
        })
    }

    componentDidMount() {
        this.init().catch(e => {
            console.error(e)
        })

        accountService.emitBox.onActiveWalletChanged((addr)=>{
            this.setState({
                account:addr
            })
        })
    }

    componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any) {
        if (prevProps.refresh != this.props.refresh) {
            this.init().catch(e => {
                console.error(e)
            })
        }
    }

    init = async () => {

        this.setState({
            nftData: await nftService.list(),
            tokens: await tokenService.list()
        })
    }

    setShowModal = (f: boolean, modal: string) => {
        this.setState({
            showModal: f,
            modal: modal
        })
    }

    reqAct = async ()=>{
        const rest = await accountService.accounts();
        this.setState({
            account:rest && rest.length>0 ?rest[0] :""
        })
    }


    render() {
        const {tab, nftData, showModal, tokens, modal,account} = this.state;
        const {router} = this.props;
        return (
            <IonPage>
                <IonHeader mode="ios" collapse="fade">
                    <IonToolbar>
                        <IonButtons slot="start">
                            <IonButton fill="solid" color="light" mode="ios" style={{margin: "12px"}} onClick={()=>{
                               if(account){
                                   accountService.showWidget();
                               }else{
                                   this.reqAct().catch(e=>{console.error(e)});
                               }
                            }}>
                                <IonIcon slot="start" icon={linkOutline}/> EMIT-Wallet
                            </IonButton>
                        </IonButtons>
                        <IonTitle className="ion-text-center">
                            Assets
                            <div><small><IonText color="medium">{account && utils.ellipsisStr(account)}</IonText></small></div>
                        </IonTitle>
                        <IonButtons slot="end">
                            <IonAvatar className="avatar" style={{margin: "0 12px 0 0"}}>
                                <IonIcon src={scanCircleOutline} size="large"/>
                            </IonAvatar>
                        </IonButtons>
                    </IonToolbar>
                </IonHeader>
                <IonContent fullscreen>
                    {/*box*/}
                    <div className="page-inner">
                        {/*head*/}
                        <div className="header">
                            <IonRow>
                                <IonCol className="avatar-item">
                                    <div>
                                        <IonAvatar className="avatar" onClick={() => {
                                            this.setShowModal(true, "send")
                                        }}>
                                            <IonIcon src={arrowUpCircleOutline} size="large"/>
                                        </IonAvatar>
                                    </div>
                                </IonCol>
                                <IonCol className="avatar-item">
                                    <div>
                                        <IonAvatar className="avatar" onClick={() => {
                                            this.setShowModal(true, "receive")
                                        }}>
                                            <IonIcon src={arrowDownCircleOutline} size="large"/>
                                        </IonAvatar>
                                    </div>
                                </IonCol>
                                <IonCol className="avatar-item">
                                    <div>
                                        <IonAvatar className="avatar" onClick={() => {
                                            this.setShowModal(true, "add")
                                        }}>
                                            <IonIcon src={addCircleOutline} size="large"/>
                                        </IonAvatar>
                                    </div>
                                </IonCol>
                            </IonRow>
                        </div>
                        <div className="content">
                            <div style={{position: 'sticky', top: 0, background: "#fff", zIndex: "1000"}}>
                                <IonSegment className="segment" mode="md" value={tab}
                                            onIonChange={e => {
                                                this.setTab(e.detail.value)
                                            }}>
                                    <IonSegmentButton className="seg-btn" mode="md" value="tokens">
                                        <IonLabel>Tokens</IonLabel>
                                    </IonSegmentButton>
                                    <IonSegmentButton className="seg-btn" mode="md" value="nfts">
                                        <IonLabel>NFTs</IonLabel>
                                    </IonSegmentButton>
                                </IonSegment>
                            </div>
                            {
                                tab == "tokens" ?
                                    <div>
                                       <TokenList tokens={tokens} onSelect={(v)=>{
                                           oRouter.txList(ChainType.BSC, v.symbol)
                                       }}/>

                                    </div> :
                                    <div>
                                        <NftList showCount items={nftData} onClickItem={(item) => {
                                            if (item) {
                                                oRouter.nftItems(item.chain, item.contract_address, item.symbol);
                                            }
                                        }}/>
                                    </div>
                            }
                        </div>
                        <div>
                            <IonModal
                                isOpen={showModal}
                                swipeToClose={true}
                                presentingElement={router || undefined}
                                onDidDismiss={() => this.setShowModal(false, "")}>
                                <div>
                                    <TokenListModal tokens={tokens}
                                               title={modal == 'add' ? "Add Tokens" : "Select Token"}
                                               onClose={() => {
                                                   this.setShowModal(false, "");
                                               }}
                                               onSend={modal == 'send' ? (token) => {
                                                   this.setShowModal(false, "");
                                                   oRouter.transferToken(token.chain,token.symbol)
                                               } : undefined}
                                               onReceive={modal == 'receive' ? (token) => {
                                                   this.setShowModal(false, "");
                                                   oRouter.addressReceive(token.chain,token.symbol)
                                               } : undefined}
                                               onAdd={modal == 'add' ? () => {

                                               } : undefined}/>

                                </div>
                                <IonButton onClick={() => this.setShowModal(false, "")}>Close Modal</IonButton>
                            </IonModal>
                        </div>
                        <div className="footer">

                        </div>
                    </div>
                </IonContent>
                {/*<IonContent fullscreen>*/}
                {/*    <IonButton onClick={(e)=>{*/}
                {/*        emitBox.showWidget().catch(e=>{*/}
                {/*            console.log("sss",e)*/}
                {/*        })*/}
                {/*    }}>Show Widget</IonButton>*/}
                {/*    <IonButton onClick={(e)=>{*/}
                {/*        // emitBox.setSelectedAddress("sdsssssss")*/}
                {/*        web3.eth.getAccounts((err,result)=>{*/}
                {/*            console.log("account:::",err,result)*/}
                {/*            this.setState({*/}
                {/*                account:result[0]*/}
                {/*            })*/}
                {/*        }).then(data=>{*/}
                {/*            console.log("data:",data);*/}
                {/*        }).catch(e=>{*/}
                {/*            console.error("getAccounte",e)*/}
                {/*        })*/}
                {/*    }}>Get Account</IonButton>*/}
                {/*    <div>*/}
                {/*        {account}*/}
                {/*    </div>*/}

                {/*    <div style={{border: "1px solid #000"}}>*/}

                {/*        <IonButton onClick={(e)=>{*/}
                {/*            web3.eth.personal.sign("TEST DATA",account,"1").then(value => {*/}
                {/*                this.setState({*/}
                {/*                    signature:value*/}
                {/*                })*/}
                {/*            })*/}

                {/*        }}>Sign</IonButton>*/}
                {/*        <div>*/}
                {/*            Text: TEST DATA*/}
                {/*        </div>*/}
                {/*        <p>*/}
                {/*            sign return: { JSON.stringify(signature) }*/}
                {/*        </p>*/}
                {/*    </div>*/}

                {/*    <div style={{border: "1px solid #000"}}>*/}

                {/*        <IonButton onClick={(e)=>{*/}
                {/*            // async () =>{*/}
                {/*            //     const dataSets = await emitBox.emitDataNode.getSettles(account);*/}
                {/*            //     const facSets = await emitBox.emitDataNode.getFactors(account);*/}
                {/*            //     const prd = await emitBox.emitDataNode.genPrepareBlock(account,dataSets,facSets)*/}
                {/*            //     const rest = await emitBox.emitDataNode.prepareBlock(prd);*/}
                {/*            // }*/}
                {/*            web3.eth.sendTransaction({*/}
                {/*                    from: account,*/}
                {/*                    gasPrice: "0x2000000",*/}
                {/*                    gas: "0x21000",*/}
                {/*                    to: '0x4B687879f72cE693F1FEE347868f053592f45292',*/}
                {/*                    value: "0x10000",*/}
                {/*                }*/}
                {/*            ).then(value => {*/}
                {/*                console.log(value,"value:")*/}
                {/*                this.setState({*/}
                {/*                    signature:value*/}
                {/*                })*/}
                {/*            }).catch(e=>{*/}
                {/*                console.log(e,"error:")*/}
                {/*            })*/}

                {/*        }}>Sign</IonButton>*/}
                {/*        <div>*/}
                {/*            Text: TEST DATA*/}
                {/*        </div>*/}
                {/*        <p>*/}
                {/*            sign return: { JSON.stringify(signature) }*/}
                {/*        </p>*/}
                {/*    </div>*/}

                {/*    <div style={{border: "1px solid #000"}}>*/}
                {/*        <IonButton onClick={(e)=>{*/}
                {/*            web3.eth.personal.ecRecover("TEST DATA",signature).then(value => {*/}
                {/*                this.setState({*/}
                {/*                    addr:value*/}
                {/*                })*/}
                {/*            })*/}

                {/*        }}>ecRecover</IonButton>*/}
                {/*        <div>*/}
                {/*            Recover Address: {addr}*/}
                {/*        </div>*/}
                {/*    </div>*/}

                {/*    <div style={{border: "1px solid #000"}}>*/}
                {/*        <IonButton onClick={(e)=>{*/}
                {/*            console.log("addr::",account);*/}
                {/*            emitBox.emitDataNode.getSettles(account).then(r=>{*/}
                {/*                console.log(r);*/}
                {/*            })*/}
                {/*        }}>get settle</IonButton>*/}
                {/*        <div>*/}
                {/*           getSettle*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*</IonContent>*/}
            </IonPage>
        );
    }


}

export default Home;
