import React, { Component } from 'react';
import './Auth.scss'
import AuthContext from '../context/auth-context'

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
      this.handleValidation()
      return;
    }

    // ...
let requestBody = {
  query: `
    query Login($email: String!, $password: String! ) {
      login(email: $email, password: $password) {
        userId
        email
        token
        tokenExpiration
      }
    }
  `,
  variables: {
    email: email,
    password: password
  }
}

if(!this.state.isLogin) {
   requestBody = {
    query: `
      mutation CreateUser($email: String!, $password: String!){
        createUser(userInput: {email: $email, password: $password}){
          _id
          email
        }
      }
    `,
    variables: {
      email: email, //the key is the graphql name we set, the value is the value pulled from evt
      password: password
    }
  };
}
    
    fetch('http://localhost:3001/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => {
      console.log('res: ', res.errors)
      if(res.status !== 200 && res.status !== 201) {
        //this.handleValidation()
        //throw new Error('Failed!')
        return
      }
      return res.json()
    }).then(resData => {
      if(resData.data.login && resData.data.login.token) {
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
            <form className="auth-form" onSubmit={this.submitHandler}>
              <div className="form-control" >
                <label htmlFor="email">Email: </label>
                <input type="email" id="email" ref={this.emailEl}/>
              </div>
              <div className="form-control" >
                <label htmlFor="password">Password: </label>
                <input type="password" id="password" ref={this.passwordEl} />
              </div>
              <div className={`form-validation ${this.state.validationMessage ? '' : 'hidden'}`}>
                <p className="cr">User Email or Password is incorrect. Try again or signup. </p>
              </div>
              <div className="form-actions" >
              <button className="pointer" type="submit">Submit</button>
                <button className="pointer" onClick={this.switchModeHandler} type="button">Switch to {this.state.isLogin ? 'Signup' : 'Login'}</button>
              </div>
            </form>

        );
    }

}

export default AuthPage;