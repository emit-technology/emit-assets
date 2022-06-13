import * as React from 'react';
import {
    IonModal,
    IonItemDivider,IonRow,IonCol,
    IonItem,
    IonLabel,
    IonText,
    IonPage,
    IonContent,
    IonTitle,
    IonHeader,
    IonToolbar, IonIcon, IonAvatar
} from '@ionic/react'
import {close} from "ionicons/icons";
import {utils} from "../../common/utils";
import config from "../../common/config";
import {ChainType} from "@emit-technology/emit-lib";
interface Props{
    isOpen:boolean;
    onOk: (txConfig:any)=>void;
    onClose: ()=>void;
    txConfig: any;
    chain: ChainType
}
export const TxConfirm:React.FC<Props> = ({isOpen,onClose,onOk,txConfig,chain}) => {
    return <IonModal
        isOpen={isOpen}
        initialBreakpoint={0.5}
        breakpoints={[0, 0.5, 1]}
        onDidDismiss={(e) => {
            onClose()
        }}>
        <IonPage>
            <IonHeader>
                <IonToolbar color="white">
                    <IonTitle>
                       Confirm Transaction
                    </IonTitle>
                    <IonIcon slot="end" icon={close} size="large" onClick={() => {
                        onClose()
                    }}/>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                {
                    utils.isWeb3Chain(chain)? <>
                        <IonItem>
                            <IonLabel className="ion-text-wrap">
                               <IonRow>
                                   <IonCol size="3">Chain</IonCol>
                                   <IonCol size="9">
                                      <IonItem lines="none">
                                          <IonAvatar slot="start">
                                              <img src={`./assets/img/chain/${chain}.png`}/>
                                          </IonAvatar>
                                          <IonLabel className="ion-text-wrap">
                                              <b>{config.chains[chain].description}</b>
                                          </IonLabel>
                                      </IonItem>
                                   </IonCol>
                               </IonRow>
                            </IonLabel>
                        </IonItem>
                    </>:<>

                    </>
                }
                {
                    tokens.map((chainName,i)=>{
                        const t = crossToken[chainName];
                        const chainId = utils.getChainByName(chainName);
                        return <IonItem key={i} onClick={()=>{
                            onOk(chainId)
                        }}>
                            <IonAvatar slot="start">
                                {/*<IonIcon src={linkOutline} size="large" className="icon-transform"/>*/}
                                <img src={`./assets/img/chain/${chainId}.png`}/>
                            </IonAvatar>
                            <IonLabel className="ion-text-wrap">
                                <b>{config.chains[chainId].description}</b>
                            </IonLabel>
                        </IonItem>
                    })
                }
            </IonContent>
        </IonPage>
    </IonModal>
}