import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import HamburgerMenu from 'react-hamburger-menu'

import AuthContext from '../../context/auth-context'
import './MainNavigation.scss'
class MainNavigation extends Component{
  state = {
    open: false,
    mobileMenuVisible: false
  }
  constructor(props) {
    super(props)
  }

  handleHamburgerMenu = () => {
    !this.state.open
      ? this.setState({ open: true , mobileMenuVisible: true})
      : this.setState({ open: false, mobileMenuVisible: false })  
  }

  static contextType = AuthContext
 render () {
  return (
    <header className="main-navigation x top left fix f jcc z1 rel">
      <div className={`main-navigation__inner f aic jcc x y jcb ${this.state.open ? "open" : ""} ${this.state.open ? "visible" : ""} `}>
        <div className="main-navigation__logo">
          <h1 className="m0 caps italic"> - Recipals - </h1>
        </div>
        <HamburgerMenu
          isOpen={this.state.open}
          menuClicked={this.handleHamburgerMenu.bind(this)}
          width={18}
          height={15}
          strokeWidth={1}
          rotate={0}
          color='black'
          borderRadius={0}
          animationDuration={0.5}
          className="hamburger-menu"
      />
        <nav className="main-navigation__items">
          <div className="arrow-up abs" />
          <ul className="f m0 p0">
            <li onClick={this.handleHamburgerMenu}><NavLink to="/recipes">All Recipes</NavLink></li>
          {
          this.context.token && 
          <React.Fragment>
            {/* <li><NavLink to="/subscriptions">Subscriptions</NavLink></li> */}
            <li>
              <div className="pointer account-welcome " >
                <div className="f jcc aic ">
                  <p className="m0 nowrap"> Welcome {this.props.email}</p>
                  <div className="pl05">+</div>
                </div>
                <div className="account-dropdown abs">
                  <div className="pointer" onClick={() => {
                    this.handleHamburgerMenu()
                    this.context.logout()
                    }}>Log Out</div>
                </div>
              </div>
            </li>
          </React.Fragment>
          }
          {!this.context.token && <li onClick={this.handleHamburgerMenu}><NavLink to="/auth">Log In</NavLink></li>}
          </ul>
        </nav>
        </div>
     
    </header>
  )}
}
  
    
      


export default MainNavigation