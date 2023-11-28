import { useEffect, useState } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { IonReactRouter } from '@ionic/react-router';
import { setupIonicReact, IonApp, IonTabs, IonRouterOutlet, IonTabBar, IonTabButton, IonIcon } from '@ionic/react';
import { addCircle, chatbubbleOutline, homeOutline, personCircleOutline, search } from 'ionicons/icons';
import Home from './pages/Home';
import Search from './pages/Search';
import Post from './pages/Post';
import Messages from './pages/Messages';
import Profile from './pages/Profile';
import Login from './pages/LoginPage';
import Register from './pages/RegisterPage';
import Start from './pages/Start';

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

/* Firebase */
import { auth, firebaseUser } from './firebase';

setupIonicReact();

const App: React.FC = () => {
  const [user, setUser] = useState<firebaseUser | null>(null);

  useEffect(() => {
    const unsubcribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubcribe();
  }, []);
  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          {!user ? (
            <>
              <Route path="/start" component={Start} exact={true} />
              <Route path="/login" component={Login} exact={true} />
              <Route path="/register" component={Register} exact={true} />
              <Redirect from="/" to="/start" />
            </>
          ) : (
            <>
              <IonTabs>
                <IonRouterOutlet>
                  <Route exact path="/home"><Home /></Route>
                  <Route exact path="/search"><Search /></Route>
                  <Route exact path="/post"><Post /></Route>
                  <Route exact path="/messages"><Messages /></Route>
                  <Route exact path="/profile"><Profile /></Route>
                  <Route path="/home/:postId" component={Home} />
                  <Redirect exact from="/" to="/home" />
                </IonRouterOutlet>

                <IonTabBar slot="bottom">
                  <IonTabButton tab="home" href="/home">
                    <IonIcon aria-hidden="true" icon={homeOutline} />
                  </IonTabButton>
                  <IonTabButton tab="search" href="/search">
                    <IonIcon aria-hidden="true" icon={search} />
                  </IonTabButton>
                  <IonTabButton tab="post" href="/post">
                    <IonIcon aria-hidden="true" icon={addCircle} />
                  </IonTabButton>
                  <IonTabButton tab="messages" href="/messages">
                    <IonIcon aria-hidden="true" icon={chatbubbleOutline} />
                  </IonTabButton>
                  <IonTabButton tab="profile" href="/profile">
                    <IonIcon aria-hidden="true" icon={personCircleOutline} />
                  </IonTabButton>
                </IonTabBar>
              </IonTabs>
            </>
          )}
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
