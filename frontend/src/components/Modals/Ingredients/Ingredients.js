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
    !Number.isNaN(value) && this.setState({ updatedYield: value })
  }
  render() {
    return (
      <div className="modal__content_ingredients-container f fdc my1 mr2 ml0 ">

      <ul className="modal__content_ingredients-list f fdc pl1">
        <div className="yield-count f">
          <p className="pr025 m0 s14 fw5">Yields</p>
        <input className="yield-count_amount s14 robo" type="number" onChange={this.yieldHandler} defaultValue={this.state.updatedYield} />
        <p className="pl025 m0 s14 fw5 ls1">servings</p>
        </div>
        {this.props.ingredients.map((ingredient, idx) => {
          return (
            <li key={idx} className="ingredient-container f aic">
              <p className="ingredient-container_amount s14 caps" >{parseFloat((ingredient.amount * this.state.updatedYield / this.props.selectedRecipe.yields).toFixed(2))} {ingredient.unit} - {ingredient.name}</p>
            </li>
          )
        })}
      </ul>
    </div>
      )
  }
  
}

export default Ingredients;