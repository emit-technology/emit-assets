import * as React from 'react';
import {useRef,useState} from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';
import {IonApp, IonRouterOutlet, setupIonicReact,IonTabs,IonTabBar,IonLabel,IonTabButton,IonIcon,IonBadge
} from '@ionic/react';
import {IonReactRouter, IonReactHashRouter} from '@ionic/react-router';
import Home from './pages/Home';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import {wallet, apps, settings, walletOutline, settingsOutline, appsOutline, cubeOutline} from "ionicons/icons";
import {NftItems} from "./pages/nft/NftItems";
import {NftDetail} from "./pages/nft/NftDetail";
import {InboxPage} from "./pages/inbox/InboxPage";
import {Receive} from "./pages/address/Receive";
import {SendPage} from "./pages/address/Send";
import {TxList} from "./pages/tx/TxList";
import {TxInfo} from "./pages/tx/TxInfo";
import {SendNftPage} from "./pages/address/SendNft";
import {Settings} from "./pages/settings/Settings";

setupIonicReact({
    mode: "ios"
});

const App: React.FC = () => {
    const routerRef = useRef<HTMLIonRouterOutletElement | null>(null);
    return (
        <div className="page">
            <div className="page-inner">
                <IonApp>
                    <IonReactHashRouter>
                        <Switch>
                            <Route exact path="/nft/:chain/:symbol/:address" component={(props)=>{
                                return <NftItems refresh={Math.floor(Date.now()/1000)}
                                                 address={props.match.params.address}
                                                 symbol={props.match.params.symbol}
                                                 chain={props.match.params.chain}
                                />

                            } }/>
                            <Route exact path="/nft/:chain/:symbol/:address/:tokenId" component={(props)=>{
                                return <NftDetail refresh={Math.floor(Date.now()/1000)}
                                                  address={props.match.params.address}
                                                  symbol={props.match.params.symbol}
                                                  chain={props.match.params.chain}
                                                  tokenId={props.match.params.tokenId}
                                />
                            } }/>
                            <Route exact path="/address/receive/:chain/:address/:token" component={(props)=>{
                                return <Receive refresh={Math.floor(Date.now()/1000)}
                                                chain={props.match.params.chain}
                                                address={props.match.params.address}
                                                token={props.match.params.token}/>
                            } }/>
                            <Route exact path="/send/token/:chain/:symbol" component={(props)=>{
                                return <SendPage refresh={Math.floor(Date.now()/1000)}
                                                 chain={props.match.params.chain}
                                                 symbol={props.match.params.symbol}/>
                            } }/>
                            <Route exact path="/send/nft/:chain/:tokenId" component={(props)=>{
                                return <SendNftPage refresh={Math.floor(Date.now()/1000)}
                                                 chain={props.match.params.chain}
                                                 tokenId={props.match.params.tokenId}/>
                            } }/>
                            <Route exact path="/tx/list/:chain/:symbol" component={(props)=>{
                                return <TxList refresh={Math.floor(Date.now()/1000)}
                                               chain={props.match.params.chain}
                                               symbol={props.match.params.symbol}/>
                            } }/>
                            <Route exact path="/tx/info/:chain/:txHash" component={(props)=>{
                                return <TxInfo refresh={Math.floor(Date.now()/1000)}
                                               chain={props.match.params.chain}
                                               txHash={props.match.params.txHash}/>
                            } }/>
                            <Route exact path="/">
                                <Redirect to="/tab/home"/>
                            </Route>
                            <Route path="/tab" render={(props)=>{
                                return <IonTabs>
                                    <IonRouterOutlet ref={routerRef}>
                                        <Route exact path="/tab/home" render={()=><Home refresh={Math.floor(Date.now()/1000)} router={routerRef.current}/>}/>
                                        <Route exact path="/tab/inbox" render={()=><InboxPage refresh={Math.floor(Date.now()/1000)} router={routerRef.current}/>}/>
                                        <Route exact path="/tab/settings" render={()=><Settings refresh={Math.floor(Date.now()/1000)} router={routerRef.current}/>}/>
                                    </IonRouterOutlet>
                                    <IonTabBar slot="bottom" style={{minHeight:"70px"}} selectedTab="assets">
                                        <IonTabButton tab="assets" href="/tab/home">
                                            <IonIcon icon={walletOutline} />
                                            <IonLabel>Assets</IonLabel>
                                        </IonTabButton>

                                        <IonTabButton tab="inbox" href="/tab/inbox">
                                            <IonIcon icon={cubeOutline} />
                                            <IonLabel>Inbox</IonLabel>
                                        </IonTabButton>

                                        <IonTabButton tab="settings" href="/tab/settings">
                                            <IonIcon icon={settingsOutline} />
                                            <IonLabel>Settings</IonLabel>
                                        </IonTabButton>
                                    </IonTabBar>
                                </IonTabs>
                            }}>
                            </Route>
                        </Switch>


                    </IonReactHashRouter>
                </IonApp>
            </div>
        </div>
    );
}

export default App;
