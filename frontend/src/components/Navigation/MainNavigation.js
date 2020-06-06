import React from 'react'
import { NavLink } from 'react-router-dom'

import AuthContext from '../../context/auth-context'
import './MainNavigation.scss'
const mainNavigation = props => (
  <AuthContext.Consumer>
    {context => {
      return (
      <header className="main-navigation x top left fix f jcc z1">
        <div className="main-navigation__inner f aic jcc x y jcb">
          <div className="main-navigation__logo">
            <h1 className="m0">The Navbar</h1>
          </div>
          <nav className="main-navigation__items">
            <ul className="f m0 p0">

              {!context.token && <li><NavLink to="/auth">Authenticate</NavLink></li>}
              <li><NavLink to="/recipes">All Recipes</NavLink></li>
            {
            context.token && 
            <React.Fragment>
              <li><NavLink to="/subscriptions">Subscriptions</NavLink></li>
              <li><button onClick={context.logout}>logout</button></li>
            </React.Fragment>
            
            }
            </ul>
          </nav>
          </div>
       
      </header>
      )
      
    }}


  </AuthContext.Consumer>
  
)


export default mainNavigation