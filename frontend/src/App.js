import React from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import './App.css';

import AuthPage from './pages/Auth'
import RecipesPage from './pages/Recipes'
import SubscriptionPage from './pages/Subscription'

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Redirect from="/" to="/auth" exact />
        <Route path="/auth" component={AuthPage} />
        <Route path="/recipes" component={RecipesPage} />
        <Route path="/subscriptions" component={SubscriptionPage} />
      </Switch>
      
    </BrowserRouter>
    
  );
}

export default App;
