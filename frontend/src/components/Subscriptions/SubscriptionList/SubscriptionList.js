import React from 'react'
import './SubscriptionList.scss'


const subscriptionList = props => (
  <ul className="subscriptions m0 p0">
    <h1 className="mx1">Recipes You Follow</h1>
    {props.subscriptions.map(subscription=> {
      return (
      <li className="subscriptions__item p05 my05 mx0 f jcb aic" key={subscription._id}>
        <div className="subscriptions__item-data">
        {subscription.recipe.recipeName} - {subscription.recipe.minutesEstimate} minutes
        </div>
        <div className="subscriptions__item-actions">
          <button className="btn" onClick={props.onUnsubscribe.bind(this, subscription._id)}>Cancel</button>
        </div>
      </li>
      )
      
    })}
  </ul>

);

export default subscriptionList