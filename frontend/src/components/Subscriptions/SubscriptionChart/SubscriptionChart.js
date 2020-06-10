import React from 'react'
import { Bar } from 'react-chartjs-2'
const subscription_buckets = {
  'Quick and Easy': {
    min: 0,
    max: 30
  },
  'Medium': {
    min: 31,
    max: 60
  },
  'Long and Involved': {
    min: 61,
    max: 100000000
  }
 }
const subscriptionChart = props => { 
  const chartData = {labels: [], datasets: [{}]}
  let values = []
  for (let bucket in subscription_buckets) {
    const filteredSubscriptionsCount = props.subscriptions.reduce((prev, current) => {
      return current.recipe.minutesEstimate > subscription_buckets[bucket].min && current.recipe.minutesEstimate <= subscription_buckets[bucket].max
      ? prev + 1
      : prev
    }, 0)
    values.push(filteredSubscriptionsCount)
    chartData.labels.push(bucket)
    chartData.datasets.push({
      backgroundColor: 'rgba(255,99,132,0.2)',
      borderColor: 'rgba(255,99,132,1)',
      borderWidth: 1,
      hoverBackgroundColor: 'rgba(255,99,132,0.4)',
      hoverBorderColor: 'rgba(255,99,132,1)',
      data: values
    })
    values = [...values]
    values[values.length-1] = 0
  }
  return(
    <React.Fragment>
      <h1>Subscriptions Chart</h1>
      <Bar
        data={chartData}
        width={100}
        height={50}
        options={{ maintainAspectRatio: false }}
      />
    </React.Fragment>
  
  )
}

export default subscriptionChart