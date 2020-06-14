import React, { Component } from 'react'
import './Ingredients.scss'

class Ingredients extends Component {
state = {
  updatedYield: this.props.selectedRecipe.yields,
}
  constructor(props){
    super(props)
  }

  yieldHandler = e => {
    const value = parseInt(e.target.value)
    console.log('value')
    !Number.isNaN(value) && this.setState({ updatedYield: value })
  }
  render() {
    console.log('this.props: ', this.props)
    return (
      <div className="modal__content_ingredients f fdc my1 mr2 ml1 ">

      <ul className="modal__content_ingredients-list f fdc pl1">
        <div className="yield-count f">
          <p className="pr05 m0">Yields</p>
        <input className="yield-count_amount" type="number" onChange={this.yieldHandler} defaultValue={this.state.updatedYield} />
        </div>
        {this.props.ingredients.map((ingredient, idx) => {
          return (
            <li key={idx} className="ingredient-container f aic">
              <p className="ingredient-container_amount" >{parseFloat((ingredient.amount * this.state.updatedYield / this.props.selectedRecipe.yields).toFixed(2))} {ingredient.unit} - {ingredient.name}</p>
            </li>
          )
        })}
      </ul>
    </div>
      )
  }
  
}

export default Ingredients;