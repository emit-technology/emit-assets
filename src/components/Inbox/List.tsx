import * as React from 'react';
import {
    IonLabel, IonModal, IonItemDivider, IonItem, IonChip, IonButton, IonCard, IonCardTitle, IonCardSubtitle, IonText,
    IonAvatar, IonCardContent, IonBadge, IonCardHeader,
    IonRow, IonCol, IonSegment, IonSegmentButton, IonIcon, IonPage, IonHeader, IonToolbar, IonTitle, IonContent
} from '@ionic/react';
import {utils} from "../../common/utils";
import {
    arrowForwardCircleOutline,
    close, ellipsisHorizontalOutline,
    linkOutline
} from "ionicons/icons";
import config from "../../common/config";
import {ChainType} from "@emit-technology/emit-lib";
import {SettleResp} from '@emit-technology/emit-lib'
import i18n from '../../locales/i18n';

interface Props {
    item: SettleResp
    onReceive: (SettleResp) => void;
}

export const InboxList: React.FC<Props> = ({item, onReceive}) => {
    const v = item;
    const [showModal,setShowModal] = React.useState(false)
    return (<>
        <IonCard>
            <IonCardHeader>
                <IonCardTitle>
                    <IonRow>
                        <IonCol size="9">
                            <IonBadge color="light"><IonIcon src={linkOutline} className="icon-transform-3"/>&nbsp;{config.chains[ChainType.EMIT].description}
                                &nbsp;<IonIcon src={arrowForwardCircleOutline} className="icon-transform-3"/>&nbsp;
                                <IonIcon src={linkOutline} className="icon-transform-3"/>&nbsp;{config.chains[ChainType.EMIT].description}</IonBadge>
                        </IonCol>
                        <IonCol>
                            <div style={{float: "right"}}><IonIcon src={ellipsisHorizontalOutline} color="medium" onClick={()=>{
                                setShowModal(true)
                            }}/></div>
                        </IonCol>
                    </IonRow>
                </IonCardTitle>
                <IonCardSubtitle>
                    {utils.dateFormat(new Date(v.factor.timestamp ))}
                </IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent>
                <div  className="balance-span2">
                    <span style={{fontSize: '28px'}}><IonText color="primary">+{utils.fromHexValue(v.factor.factor.value).toString(10)}</IonText></span>&nbsp;
                    <IonBadge>
                        {utils.formatCategoryString(v.factor.factor.category)}&nbsp;
                        <small style={{
                            fontSize: "35%",
                            letterSpacing: "0"
                        }}>[{utils.ellipsisStr(v.factor.factor.category.supplier, 4)}]</small>
                    </IonBadge>
                </div>

                {
                    !v.settled && <IonRow>
                        <IonCol offset="7" size="5">
                            <IonButton expand="block" size="small" onClick={() => {
                                setShowModal(false);
                                onReceive(v)
                            }}>{i18n.t("receive")}</IonButton>
                        </IonCol>
                    </IonRow>
                }
                {
                    v.settled && <IonRow>
                        <IonCol offset="7" size="5">
                            <IonBadge color="medium">Settled</IonBadge>
                        </IonCol>
                    </IonRow>
                }

            </IonCardContent>

        </IonCard>

        <IonModal
            isOpen={showModal}
            initialBreakpoint={0.5}
            breakpoints={[0, 0.5, 1]}
            onDidDismiss={(e) => {
               setShowModal(false)
            }}>
            <IonPage >
                <IonHeader>
                    <IonToolbar color="white">
                        <IonTitle>
                            {i18n.t("detail")}
                        </IonTitle>
                        <IonIcon slot="end" icon={close} size="large" onClick={() => {
                            setShowModal(false)
                        }}/>
                    </IonToolbar>
                </IonHeader>
                <IonContent>

                    <IonItem>
                        <IonLabel className="ion-text-wrap">
                            <IonRow>
                                <IonCol size="4">{i18n.t("from")}</IonCol>
                                <IonCol size="8">{item.from_index_key.from}</IonCol>
                            </IonRow>
                        </IonLabel>
                    </IonItem>
                    <IonItem>
                        <IonLabel className="ion-text-wrap">
                            <IonRow>
                                <IonCol size="4">{i18n.t("block")}</IonCol>
                                <IonCol size="8"><IonBadge>{item.from_index_key.num}</IonBadge></IonCol>
                            </IonRow>
                        </IonLabel>
                    </IonItem>
                    <IonItem>
                        <IonLabel className="ion-text-wrap">
                            <IonRow>
                                <IonCol size="4">{i18n.t("timestamp")}</IonCol>
                                <IonCol size="8">{utils.dateFormat(new Date(item.factor.timestamp))}</IonCol>
                            </IonRow>
                        </IonLabel>
                    </IonItem>
                    <IonItem>
                        <IonLabel className="ion-text-wrap">
                            <IonRow>
                                <IonCol size="4">Factor</IonCol>
                                <IonCol size="8">
                                    <div  className="balance-span2">
                                        <span style={{fontSize: '28px'}}><IonText color="primary">+{utils.fromHexValue(v.factor.factor.value).toString(10)}</IonText></span>&nbsp;
                                        <IonBadge>
                                            {utils.formatCategoryString(v.factor.factor.category)}&nbsp;
                                            <small style={{
                                                fontSize: "35%",
                                                letterSpacing: "0"
                                            }}>[{utils.ellipsisStr(v.factor.factor.category.supplier, 4)}]</small>
                                        </IonBadge>
                                    </div>
                                </IonCol>
                            </IonRow>
                        </IonLabel>
                    </IonItem>
                    <IonItem>
                        <IonLabel className="ion-text-wrap">
                            <IonRow>
                                <IonCol size="4">{i18n.t("status")}</IonCol>
                                <IonCol size="8">{item.settled?<IonBadge color="success">Settled</IonBadge>:<IonButton expand="block" onClick={()=>{
                                    setShowModal(false)
                                    onReceive(item)
                                }}>{i18n.t("receive")}</IonButton>}</IonCol>
                            </IonRow>
                        </IonLabel>
                    </IonItem>
                </IonContent>
            </IonPage>
        </IonModal>
    </>)
}