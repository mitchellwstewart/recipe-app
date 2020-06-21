import React, { Component } from 'react'
import './Ingredients.scss'


class Ingredient extends Component {

  constructor(props){
    super(props)
    this.state = {
      startingYield: this.props.yields
    }
  }
  render() {
    return (          
      <li key={this.props.idx} className="ingredient-container f aic">
        <p className="ingredient-container_amount s14 caps" >{parseFloat((this.props.ingredient.amount * this.props.yields / this.state.startingYield).toFixed(2))} {this.props.ingredient.unit} - {this.props.ingredient.name}</p>
      </li>
    )
  }
}

export default Ingredient;