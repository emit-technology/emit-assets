import * as React from 'react';
import {
    IonBadge,
    IonButton,
    IonCol,
    IonContent,
    IonHeader,
    IonIcon,
    IonInput,
    IonItem,
    IonLabel,
    IonLoading,
    IonPage,
    IonRow,
    IonText,
    IonTextarea,
    IonTitle,
    IonToast,
    IonToolbar
} from '@ionic/react';
import { Token} from "../../types";
import {ChainType} from '@emit-technology/emit-lib';
import {
    arrowBackOutline,
    arrowForwardCircleSharp,
    chevronDownOutline,
    chevronForwardOutline,
    linkOutline
} from "ionicons/icons";
import './index.css';
import {oRouter} from "../../common/roter";
import {tokenService} from "../../service/token";
import {gasService} from "../../service/gas";
import {emitBoxSdk} from "../../service/emit";
import {utils} from "../../common/utils";
import rpc from "../../rpc";
import config from "../../common/config";
import {SelectChainModal} from "../../components/Chains/SelectChainModal";
import {crossConfig} from "../../service/cross/config";
import {CrossToken} from "../../types/cross";
import BigNumber from "bignumber.js";
import {txService} from "../../service/tx";

interface Props {
    refresh: number;
    chain: ChainType;
    symbol: string;
    tokenAddress:string
}

interface State {
    token?: Token
    receive?: string
    amount?: string
    showLoading: boolean;
    showToast: boolean;
    toastMsg?: string;
    targetChain: ChainType;
    showSelectChain: boolean
    crossToken: CrossToken,
    resourceId?: string
    allowance: BigNumber
}

export class SendPage extends React.Component<Props, State> {

    state: State = {
        showLoading: false,
        showToast: false,
        targetChain: this.props.chain,
        showSelectChain: false,
        crossToken: {},
        allowance: new BigNumber(0),
    }

    componentDidMount() {
        this.init().catch(e => {
            console.error(e)
        })
    }

    init = async () => {
        const {chain, symbol,tokenAddress} = this.props;
        const token = await tokenService.getTokenBalance(chain, symbol,tokenAddress);
        const crossResource = await crossConfig.getTargetTokens(symbol, chain,tokenAddress);
        const resourceIds = Object.keys(crossResource);
        if (resourceIds && resourceIds.length > 0) {
            this.setState({token: token, crossToken: crossResource[resourceIds[0]], resourceId: resourceIds[0]})
        } else {
            this.setState({token: token})
        }
    }


    nextConfirm = async () => {
        const {chain} = this.props;
        const {receive, amount, token, targetChain} = this.state;

        if (!receive) {
            this.setShowToast(true, "Receive address is required !")
            return;
        }
        if (!amount) {
            this.setShowToast(true, "Amount is required !")
            return;
        }
        if (!utils.checkAddress(receive, targetChain)) {
            this.setShowToast(true, `Address of [${ChainType[targetChain]}] sum-check failed!`)
            return;
        }

        this.setShowLoading(true);
        // await emitBoxSdk.emitBox.batchSignMsg([{chain:2,msg:{test:1,a:3,b:3}},{chain:2,msg:{test:1,a:3,b:3}},{chain:2,msg:{test:1,a:3,b:3}},{chain:2,msg:{test:1,a:3,b:3}}])
        const ret = await txService.send(chain, receive, amount, token, targetChain)

        await this.confirm(chain, ret)
        oRouter.txInfo(chain,ret.transactionHash,ret.blockNumber);
    }

    confirm = async (chain: ChainType, tx: any) => {
        if (utils.isWeb3Chain(chain)) {
            let count = 0;
            return new Promise((resolve, reject) => {
                let interId;
                interId = setInterval(() => {
                    count++;
                    if (count > 60) {
                        clearInterval(interId);
                        reject("Pending timeout!")
                    } else {
                        rpc.getTxInfo(chain, tx.transactionHash).then(rest => {
                            if (rest && rest.num > 0) {
                                clearInterval(interId)
                                resolve(true)
                            }
                        }).catch(e => {
                            console.error(e)
                        });
                    }
                }, 1500)
            })
        }
        return true
    }

    setShowLoading = (f: boolean) => {
        this.setState({
            showLoading: f
        })
    }

    setShowToast = (f: boolean, msg?: string) => {
        this.setState({
            showToast: f,
            toastMsg: msg
        })
    }

    setShowSelectChain = (f: boolean) => {
        this.setState({
            showSelectChain: f
        })
    }

    setSelectChain = async (targetChain: ChainType) => {
        const {chain} = this.props;
        const {token} = this.state;
        let allowance = new BigNumber(0)
        if (chain != targetChain) {
            const account = await emitBoxSdk.getAccount();
            if (utils.isWeb3Chain(chain) && utils.isErc20Token(token)) {
                const handleAddress = await crossConfig.getTokenContractHandle(chain)
                allowance = await tokenService.allowance(token, handleAddress);
            }
            this.setState({
                receive: account.addresses[targetChain],
                allowance: allowance,
                targetChain: targetChain,
                showSelectChain: false,
            })
        } else {
            this.setState({
                allowance: allowance,
                receive: "",
                targetChain: targetChain,
                showSelectChain: false
            })
        }

    }

    needApprove = ():boolean =>{
        const {chain} = this.props;
        const {targetChain,allowance} = this.state;
        return allowance.toNumber() == 0 && (chain!=targetChain) && utils.isWeb3Chain(chain);
    }


    render() {
        const {chain, symbol} = this.props;
        const {token, showLoading, showToast, crossToken,allowance,resourceId, showSelectChain, toastMsg, amount, receive, targetChain} = this.state;

        // const fee = utils.fromValue(new BigNumber(gas).multipliedBy(new BigNumber(gasPrice)),18).toString(10);

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
                    <div style={{textAlign: "center"}}>
                        <IonRow>
                            <IonCol size="5"><IonBadge color="light">
                                <IonIcon src={linkOutline}
                                         style={{transform: "translateY(2px)"}}/> {config.chains[chain].description}
                            </IonBadge></IonCol>
                            <IonCol size="2"><IonIcon src={arrowForwardCircleSharp}/></IonCol>
                            <IonCol size="5"><IonBadge color="light" onClick={() => {
                                if (resourceId) {
                                    this.setShowSelectChain(true);
                                }
                            }}><IonIcon src={linkOutline}
                                        style={{transform: "translateY(2px)"}}/>
                                        &nbsp;{config.chains[targetChain].description}&nbsp;
                                {
                                    resourceId && <IonIcon src={chevronDownOutline}
                                                           style={{transform: "translateY(2px)"}}/>
                                }
                            </IonBadge></IonCol>
                        </IonRow>
                    </div>
                    <IonItem lines="none">
                        <IonLabel position="stacked">Address</IonLabel>
                        <IonTextarea disabled={chain != targetChain}
                                     placeholder={`Input ${config.chains[targetChain].description} address`} autoGrow
                                     value={receive} clearOnEdit color="primary" onIonChange={(e) => {
                            //TODO validation
                            this.setState({
                                receive: e.detail.value
                            })
                        }} autofocus className="input-addr"/>
                    </IonItem>
                    <div style={{padding: "0 12px"}}>
                        <IonRow>
                            <IonCol size="3">Amount</IonCol>
                            <IonCol size="7"><span className="balance-span"><IonText
                                color="medium">Available {token && utils.nFormatter(token.balance, 4)}</IonText></span></IonCol>
                            <IonCol size="2"><span className="btn-max" onClick={(e)=>{
                                e.preventDefault()
                                this.setState({amount: token.balance})
                            }}>MAX</span></IonCol>
                        </IonRow>
                    </div>
                    <IonItem lines="none">
                        <IonLabel position="stacked">

                        </IonLabel>
                        <div className="input-d1">
                            <IonInput placeholder="0.00" value={amount} clearOnEdit color="primary" onIonChange={(e) => {
                                this.setState({
                                    amount: e.detail.value
                                })
                            }} className="input-amt" inputMode="decimal"/>
                            <div className="input-d2">{token && token.symbol}</div>
                        </div>
                    </IonItem>
                    {/*{*/}
                    {/*    utils.isWeb3Chain(chain) &&*/}
                    {/*    <IonItem lines="none" detail detailIcon={chevronForwardOutline} onClick={()=>{*/}
                    {/*        emitBoxSdk.emitBox.calcGasPrice(utils.toHex(25000),chain.valueOf()).then(rest=>{*/}
                    {/*            this.setState({gasPrice: utils.toValue(rest.result,9).toString(10)})*/}
                    {/*        }).catch(e=>console.error(e))*/}
                    {/*    }}>*/}
                    {/*        <IonLabel>Fee</IonLabel>*/}
                    {/*        <IonLabel className="ion-text-wrap" slot="end">*/}
                    {/*            <p>*/}
                    {/*                <IonText color="medium">{fee} {token && token.feeCy}</IonText>*/}
                    {/*            </p>*/}
                    {/*            <p>*/}
                    {/*                <IonText color="medium">{utils.fromValue(gasPrice,9).toString(10)}GWei * {gas}</IonText>*/}
                    {/*            </p>*/}
                    {/*        </IonLabel>*/}
                    {/*    </IonItem>*/}
                    {/*}*/}
                    <div style={{padding: "48px 12px"}}>
                        <IonButton expand="block" disabled={!amount || !receive} onClick={() => {
                            this.nextConfirm().then(() => {
                                this.setShowLoading(false)
                            }).catch(e => {
                                const err = typeof e == 'string'?e:e.message;
                                this.setShowLoading(false)
                                this.setShowToast(true,err)
                                console.error(e)
                            })

                        }}>{this.needApprove()?"Approve":"Transfer"}</IonButton>
                    </div>
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
                    <SelectChainModal isOpen={showSelectChain} crossToken={crossToken}
                                      onOk={(v) => {
                                          this.setSelectChain(v).catch(e=>{
                                              console.error(e)
                                          })
                                      }} onCancel={
                        () => this.setShowSelectChain(false)
                    }/>
                </IonContent>
            </IonPage>
        );
    }
}