import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import './App.scss';

import AuthPage from './pages/Auth'
import RecipesPage from './pages/Recipes'
import SubscriptionPage from './pages/Subscription'
import MainNavigation from './components/Navigation/MainNavigation'
import AuthContext from './context/auth-context';

class App extends Component {
  state = {
    token: null,
    userId: null,
    email: null,
  }
  login = (token, email, userId, tokenExpiration) => {
    this.setState({token: token, email: email, userId: userId})
    localStorage.setItem('jwt', token)
    localStorage.setItem('userId', userId)
    localStorage.setItem('email', email)
  }

  logout = () => {
    localStorage.removeItem('jwt')
    localStorage.removeItem('userId')
    localStorage.removeItem('email')
    this.setState({token: null, userId: null})
  }

  componentDidMount = () => {
    let LStoken = localStorage.getItem('jwt')
    let LSuser = localStorage.getItem('userId')
    let LSemail = localStorage.getItem('email')
    LStoken && LSuser && this.setState({token: LStoken, userId: LSuser , email: LSemail})
  }
  render (){
    return (
      <BrowserRouter>
        <React.Fragment>
          <AuthContext.Provider value={{token: this.state.token, email: this.state.email, userId: this.state.userId, login: this.login, logout: this.logout}}>
          <MainNavigation email={this.state.email} />
            <main className="main-content">
              <Switch>
                {this.state.token && <Redirect from="/" to="/recipes" exact />}
                {this.state.token && <Redirect from="/auth" to="/recipes" exact />}
                {!this.state.token && <Route path="/auth" component={AuthPage} />}
                <Route path="/recipes" component={RecipesPage} />
                {this.state.token && <Route path="/subscriptions" component={SubscriptionPage} />}
                {!this.state.token && <Redirect to="/auth" exact />}
              </Switch>
            </main>
          </AuthContext.Provider>
        </React.Fragment>
      </BrowserRouter>
  )}
}

export default App;
