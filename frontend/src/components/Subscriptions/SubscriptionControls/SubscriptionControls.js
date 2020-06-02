import React from 'react'
import './SubscriptionControls.scss'

const subscriptionControls = props => {
  console.log('render subscription controls')
  return(
    <div className="subscriptions-control ac p05">
      <button className={props.activeOutputType === 'list' ? ' btn active ' : ' btn '} onClick={props.changeOutputTypeHandler.bind(this, 'list')}>List</button>
      <button className={props.activeOutputType === 'chart' ? ' btn active ' : ' btn '} onClick={props.changeOutputTypeHandler.bind(this, 'chart')}>Chart</button>
    </div>
  )
}

export default subscriptionControls