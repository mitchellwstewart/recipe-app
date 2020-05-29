import React from 'react'
import { NavLink } from 'react-router-dom'
import './MainNavigation.scss'
const mainNavigation = props => (
  <header className="main-navigation f aic top left x fix">
    <div className="main-navigation__logo">
      <h1 className="m0">The Navbar</h1>
    </div>
    <nav className="main-navigation__items">
      <ul className="f m0 p0">
        <li><NavLink to="/auth">Authenticate</NavLink></li>
        <li><NavLink to="/recipes">Recipes</NavLink></li>
        <li><NavLink to="/subscriptions">Subscriptions</NavLink></li>
      </ul>
    </nav>
  </header>
)


export default mainNavigation