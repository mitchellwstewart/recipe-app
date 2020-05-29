import React from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import './App.scss';

import AuthPage from './pages/Auth'
import RecipesPage from './pages/Recipes'
import SubscriptionPage from './pages/Subscription'
import MainNavigation from './components/Navigation/MainNavigation'

function App() {
  return (
    <BrowserRouter>
      <React.Fragment>
        <MainNavigation />
        <main className="main-content">
          <Switch>
            <Redirect from="/" to="/auth" exact />
            <Route path="/auth" component={AuthPage} />
            <Route path="/recipes" component={RecipesPage} />
            <Route path="/subscriptions" component={SubscriptionPage} />
          </Switch>
        </main>
      </React.Fragment>
    </BrowserRouter>
    
  );
}

export default App;
