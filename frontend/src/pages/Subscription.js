import React, { Component } from 'react';
import AuthContext from '../context/auth-context'
import Spinner from '../components/Spinner/Spinner'
import SubscriptionList from '../components/Subscriptions/SubscriptionList/SubscriptionList'
import SubscriptionChart from '../components/Subscriptions/SubscriptionChart/SubscriptionChart'
import SubscriptionControl from '../components/Subscriptions/SubscriptionControls/SubscriptionControls'


class SubscriptionsPage extends Component {
  state = {
    isLoading: false,
    subscriptions: [],
    outputType: 'list'
  }

  static contextType = AuthContext

  componentDidMount() {
    this.fetchSubscriptions()
  }




  fetchSubscriptions = () => {
    this.setState({isLoading: true})
    const requestBody = {
      query: `
        query {
          subscriptions {
            _id
            createdAt
            recipe {
              _id
              recipeName
              date
              minutesEstimate
            }
          }
        }
      `
    }
  
      fetch('http://localhost:3001/graphql', {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.context.token
        }
      }).then(res => {
        if(res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!')
        }
        return res.json()
      }).then(resData => {
        const subscriptions = resData.data.subscriptions
        this.setState({subscriptions: subscriptions, isLoading: false})
      })
      
      .catch(err => {
        this.setState({isLoading: false})
        throw err
      })
  }

  unsubscribeRecipeHandler = (subscriptionId) => {
    this.setState({isLoading: true})
    const requestBody = {
      query: `
        mutation UnsubscribeFromRecipe($id: ID!) {
          unsubscribeFromRecipe(subscriptionId: $id) {
            _id
            recipeName
          }
        }
      `,
      variables: {
        id: subscriptionId
      }
    }
  
      fetch('http://localhost:3001/graphql', {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.context.token
        }
      }).then(res => {
        if(res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!')
        }
        return res.json()
      }).then(resData => {
        
        this.setState(prevState => {
          const updatedSubscriptions = prevState.subscriptions.filter(subscription => subscription._id !== subscriptionId)
          return {subscriptions: updatedSubscriptions, isLoading: false}
        }
          )
      })
      
      .catch(err => {
        this.setState({isLoading: false})
        throw err
      })
  }


  changeOutputTypeHandler = outputType => {
    outputType === "list" ? this.setState({outputType: 'list'}) : this.setState({outputType: 'chart'})
  }
    render() {
      let content = <Spinner />
      if(!this.state.isLoading) {
        content = (
          <React.Fragment>
            <SubscriptionControl  activeOutputType={this.state.outputType} changeOutputTypeHandler = {this.changeOutputTypeHandler}/>
            <div>
            {this.state.outputType === 'list' 
            ? <SubscriptionList subscriptions={this.state.subscriptions} onUnsubscribe={this.unsubscribeRecipeHandler}/>  
            : <SubscriptionChart subscriptions={this.state.subscriptions}/>
          }
            </div>
          </React.Fragment>
        )
      }
        return(
          <React.Fragment>
            {content}
          </React.Fragment>
            
        );
    }

}

export default SubscriptionsPage;