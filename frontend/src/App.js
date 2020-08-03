import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import './App.scss';

import AuthPage from './pages/Auth'
import RecipesPage from './pages/Recipes'
import SubscriptionPage from './pages/Subscription'
import MainNavigation from './components/Navigation/MainNavigation'
import AuthContext from './context/auth-context';
import { checkForUserQuery, logoutQuery } from './graphqlQueries/queries'
require('dotenv').config()

class App extends Component {
  state = {
    token: null,
    tokenExpiration: null,
    userId: null,
    email: null,
  }
  login = (token, email, userId, tokenExpiration) => {
    console.log('logging in - save this to session cookie? ')
    this.setState({token: token, tokenExpiration: tokenExpiration, email: email, userId: userId})
    // localStorage.setItem('jwt', token)
    // localStorage.setItem('jwtExpiration', tokenExpiration)
    // localStorage.setItem('loginTime', new Date().toISOString())
    // localStorage.setItem('userId', userId)
    // localStorage.setItem('email', email)
  }

  logout = () => {
    // localStorage.removeItem('jwt')
    // localStorage.removeItem('jwtExpiration')
    // localStorage.removeItem('loginTime', new Date().toISOString())
    // localStorage.removeItem('userId')
    // localStorage.removeItem('email')
    

    const requestBody = { query: logoutQuery }
    fetch('http://localhost:3001/graphql', {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => {
      if(res.status !== 200 && res.status !== 201) {
        throw new Error('Failed!')
      }
      return res.json()
    }).then(resData => {
      console.log("resData for Logout: ", resData)
      if(resData.data.logout) {
        console.log('user logged out: setState')
        this.setState({token: null, userId: null})
      }
    })
    .catch(err => {
      throw err
    })
  }

  checkSession = () => {
    const requestBody = { query: checkForUserQuery }
      fetch('http://localhost:3001/graphql', {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => {
        if(res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!')
        }
        return res.json()
      }).then(resData => {
        console.log("resData: ", resData)
        if(resData.data.checkForUser) {
          console.log('user found: setState')
          this.setState({token: resData.data.checkForUser.token, tokenExpiration: resData.data.checkForUser.tokenExpiration, email: resData.data.checkForUser.email, userId: resData.data.checkForUser.userId}) 
        }
      })
      .catch(err => {
        throw err
      })
  }

  componentDidMount = () => {
    console.log('check cookie, make a request to backend to validate user based on sid')
    this.checkSession()
    console.log('this.context: ', this.context)
    // let LStoken = localStorage.getItem('jwt')
    // let LSuser = localStorage.getItem('userId')
    // let LSemail = localStorage.getItem('email')
    // let LSloginTime = localStorage.getItem('loginTime')
    // let LStokenExpiration = localStorage.getItem('jwtExpiration')
    // let currentTime = new Date().getTime()
    // console.log('currentTime: ', currentTime)
    // console.log('LStokenExpiration: ', LStokenExpiration)
    // console.log('currentTime - new Date(LSloginTime).getTime(): ', currentTime - new Date(LSloginTime).getTime())
    // console.log(' +LStokenExpiration * 60 * 60 * 1000: ',  +LStokenExpiration * 60 * 60 * 1000)

    // if(currentTime - new Date(LSloginTime).getTime() > +LStokenExpiration * 60 * 60 * 1000) {
    //   this.logout()
    // }
    // else {
    //   LStoken && LSuser && this.setState({token: LStoken, userId: LSuser , email: LSemail})
    // }
    
  }
  render (){
    return (
      <BrowserRouter>
        <React.Fragment>
          <AuthContext.Provider value={{token: this.state.token, email: this.state.email, userId: this.state.userId, login: this.login, logout: this.logout}}>
          <MainNavigation email={this.state.email} />
            <main className="main-content f fdc aic jcc">
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
