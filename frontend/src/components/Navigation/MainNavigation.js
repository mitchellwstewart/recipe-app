import React from 'react'
import { NavLink } from 'react-router-dom'

import AuthContext from '../../context/auth-context'
import './MainNavigation.scss'
const mainNavigation = props => (
  <AuthContext.Consumer>
    {context => {
      return (
      <header className="main-navigation f aic top left x fix">
        <div className="main-navigation__logo">
          <h1 className="m0">The Navbar</h1>
        </div>
        <nav className="main-navigation__items">
          <ul className="f m0 p0">

            {!context.token && <li><NavLink to="/auth">Authenticate</NavLink></li>}
            <li><NavLink to="/recipes">Recipes</NavLink></li>
           {
           context.token && 
           <React.Fragment>
            <li><NavLink to="/subscriptions">Subscriptions</NavLink></li>
            <li><button onClick={context.logout}>logout</button></li>
           </React.Fragment>
           
           }
          </ul>
        </nav>
      </header>
      )
      
    }}


  </AuthContext.Consumer>
  
)


export default mainNavigation