import React, { Component } from 'react';
import './Auth.scss'
import AuthContext from '../context/auth-context'
import Button from '@material-ui/core/Button';
import { loginQuery, createUserMutation } from '../graphqlQueries/queries'

class AuthPage extends Component {
  state = {
    isLogin: true,
    validationMessage: false
  }

  static contextType = AuthContext;
  constructor(props) {
    super(props);
    this.emailEl = React.createRef();
    this.passwordEl = React.createRef();
  }

  handleValidation = () => {
    this.setState({validationMessage: true})
    setTimeout(() => this.setState({validationMessage: false}), 3000)
  }
  switchModeHandler = () => {
    this.setState(prevState => {
      return {isLogin: !prevState.isLogin}
    })
  }

  submitHandler = (evt) => {
    evt.preventDefault();
    const email = this.emailEl.current.value;
    const password = this.passwordEl.current.value;
    if(email.trim().length === 0 || password.trim().length === 0) {
      console.log('not here')
      this.handleValidation()
      return;
    }

    // ...
  let requestBody = {
    query: loginQuery,
    variables: {
      email: email,
      password: password
    }
  }

  if(!this.state.isLogin) {
    requestBody = {
      query: createUserMutation,
      variables: {
        email: email, //the key is the graphql name we set, the value is the value pulled from evt
        password: password
      }
    };
  }
    
  fetch('http://localhost:3001/graphql', {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify(requestBody),
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(res => {
    console.log('res: ', res)
    console.log('res.erros: ', res.errors)
    console.log('res.locals: ', res.locals)
    if(res.status !== 200 && res.status !== 201) {
      //this.handleValidation()
      //throw new Error('Failed!')
      return
    }
    return res.json()
  }).then(resData => {
    console.log('login Res Data: ', resData)
    if(resData.data.login && resData.data.login.token) {
      console.log('this.context: ', this.context)
      this.context.login(resData.data.login.token, resData.data.login.email, resData.data.login.userId, resData.data.login.tokenExpiration)
    }
  })
  .catch(err => {
    console.log('err: ', err)
    this.handleValidation()
    //throw err
  })
};

  
    render() {
        return(
          <div className="auth-container f fdc">
            <h3 className="ccr">{this.state.isLogin ? "Welcome back! Log in with your email" : "Welcome! Sign up for an account"}</h3>
            <form className="auth-form" onSubmit={this.submitHandler}>
              <div className="form-control" >
                <label htmlFor="email" className="ccr">Email: </label>
                <input type="email" id="email" ref={this.emailEl}/>
              </div>
              <div className="form-control" >
                <label htmlFor="password" className="ccr">Password: </label>
                <input type="password" id="password" ref={this.passwordEl} />
              </div>
              <div className={`form-validation ${this.state.validationMessage ? '' : 'hidden'}`}>
                <p className="cr">User Email or Password is incorrect. Try again or signup. </p>
              </div>
              <div className="form-actions" >
              <Button className="btn pointer mr05" type="submit" >Submit</Button>
              
                <Button className=" btn pointer mr05" onClick={this.switchModeHandler} type="button">Switch to {this.state.isLogin ? 'Signup' : 'Login'}</Button>
              </div>
            </form>
          </div>
        );
    }

}

export default AuthPage;