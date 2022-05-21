import * as React from 'react';
import {
    IonAvatar,
    IonButton,
    IonButtons,
    IonCol,
    IonContent,
    IonHeader, IonToast,
    IonIcon,
    IonLabel,
    IonModal,
    IonPage, IonLoading,
    IonRow,
    IonSegment, IonText,
    IonSegmentButton,
    IonTitle,
    IonToolbar
} from '@ionic/react';
import './Home.css';
import {AccountModel} from "../types";
import {
    arrowDownCircleOutline,
    arrowUpCircleOutline,
    linkOutline, optionsOutline,
    scanCircleOutline
} from "ionicons/icons";
import {NftList} from "../components/Nft/List";
import {oRouter} from "../common/roter";
import {NftStandard, Token} from "../types";
import {TokenList} from "../components/Tokens/List";
import {tokenService} from "../service/token";
import {TokenListModal} from "../components/Tokens/ListModal";
import {accountService} from "../service/emit/account";
import {utils} from "../common/utils";
import config from "../common/config";
import {interVarBalance} from "../common/interVal";

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
    addr: string;
    account?: AccountModel;
    allTokens: Array<Token>;
    showLoading: boolean;
    showToast: boolean;
    toastMsg?: string
}

export class Home extends React.Component<Props, State> {

    state: State = {
        tab: "tokens",
        nftData: config.recommendNfts,
        showModal: false,
        tokens: config.recommendTokens,
        modal: "",
        addr: "",
        allTokens: [],
        showLoading: false,
        showToast: false
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
        accountService.emitBox.onActiveAccountChanged((account) => {
            accountService.setAccount(account).catch(e => console.error(e))
            this.setState({
                account: account
            })
            this.initBalance(account).catch(e => console.error(e));
        })

        //auto fetch balance;
        interVarBalance.start(() => {
            this.initBalance().catch(e => console.error(e))
        }, 5 * 1000, true)
    }

    componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any) {
        if (prevProps.refresh != this.props.refresh) {
            this.init().catch(e => console.error(e));
        }
    }

    init = async () => {
        const account = await accountService.getAccount();
        await this.initBalance(account);
        const tks = await tokenService.list(true);
        this.setState({
            allTokens: tks
        })
    }

    initBalance = async (act?: AccountModel) => {
        const {account} = this.state;
        if (!act) {
            act = account;
        }
        if (act) {
            const tokensCache = await tokenService.getTokenWithBalance(act);
            this.setState({tokens: tokensCache, account: act});

            tokenService.getBalanceRemote(act).then(token => {
                this.setState({tokens: token});
            });
        }
    }

    setShowModal = (f: boolean, modal: string) => {
        this.setState({
            showModal: f,
            modal: modal
        })
    }

    setShowLoading = (f: boolean) => {
        this.setState({
            showLoading: f
        })
    }

    requestAccount = async () => {
        const account = await accountService.emitBox.requestAccount()
        await accountService.setAccount(account.result);
        this.setState({
            account: account.result,
        })
        this.setShowLoading(true);
        await this.init();
    }

    setShowToast = (f: boolean, msg?: string) => {
        this.setState({
            showToast: f,
            toastMsg: msg
        })
    }

    render() {
        const {tab, nftData, showModal, tokens, showToast, toastMsg, showLoading, modal, allTokens, addr, account} = this.state;
        const {router} = this.props;
        return (
            <IonPage>
                <IonHeader mode="ios" collapse="fade">
                    <IonToolbar>
                        <IonButtons slot="start">
                            <IonButton fill="solid" color="light" mode="ios" style={{margin: "12px"}} onClick={() => {
                                this.requestAccount().then(() => {
                                    this.setShowLoading(false)
                                }).catch(e => {
                                    console.error(e)
                                    this.setShowLoading(false)
                                });
                            }}>
                                <IonIcon slot="start" icon={linkOutline}/> EMIT-Wallet
                            </IonButton>
                        </IonButtons>
                        <IonTitle className="ion-text-center" onClick={() => {

                        }}>
                            {account && account.name}
                            <div><small><IonText color="medium">{addr && utils.ellipsisStr(addr)}</IonText></small>
                            </div>
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
                                            <IonIcon src={optionsOutline} size="large"/>
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
                                        <TokenList tokens={tokens} onSelect={(v) => {
                                            oRouter.txList(v.chain, v.symbol)
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
                                    <TokenListModal tokens={modal == 'add' ? allTokens : tokens}
                                                    title={modal == 'add' ? "Add Tokens" : "Select Token"}
                                                    onClose={() => {
                                                        this.initBalance().catch(e => console.error(e))
                                                        this.setShowModal(false, "");
                                                    }}
                                                    onSend={modal == 'send' ? (token) => {
                                                        this.setShowModal(false, "");
                                                        oRouter.transferToken(token.chain, token.symbol)
                                                    } : undefined}
                                                    onReceive={modal == 'receive' ? (token) => {
                                                        this.setShowModal(false, "");
                                                        oRouter.addressReceive(token.chain, token.symbol, account.addresses[token.chain])
                                                    } : undefined}
                                                    onHide={modal == 'add' ? (hide, token) => {
                                                        tokenService.hide(hide, token)
                                                    } : undefined} doReorder={(event) => {
                                        const sortItems = event.detail.complete(allTokens);
                                        tokenService.setSortNum(sortItems);
                                        this.setState({
                                            allTokens: sortItems
                                        })
                                    }}/>

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
                <IonLoading
                    cssClass='my-custom-class'
                    isOpen={showLoading}
                    onDidDismiss={() => this.setShowLoading(false)}
                    message={'Loading balance...'}
                    duration={60 * 1000}
                />

                <IonToast
                    isOpen={showToast}
                    onDidDismiss={() => this.setShowToast(false)}
                    message={toastMsg}
                    duration={1500}
                />

            </IonPage>
        );
    }


}

export default Home;