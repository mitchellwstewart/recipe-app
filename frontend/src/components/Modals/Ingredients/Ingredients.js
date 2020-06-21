import React, { Component } from 'react'
import './Ingredients.scss'
import Ingredient from './Ingredient'
import IngredientEdit from './IngredientEdit'

class Ingredients extends Component {
state = {
  updatedYield: this.props.selectedRecipe 
    ? this.props.selectedRecipe.yields 
    : this.props.recipeToUpdate 
      ? this.props.recipeToUpdate.yields 
      : 1,
  ingredientsAdded: [],
  ingredientValidation: false,
  openNewIngredientDropdown: false,

}
  constructor(props){
    super(props)
  }

  yieldHandler = e => {
    console.log('e.target.value: ', e.target.value)
    const value = parseFloat(e.target.value)
    !Number.isNaN(value) && this.setState({ updatedYield: value })
  }
  componentDidMount = async () => {
    this.props.selectedRecipe && this.setState({ ingredientsAdded: this.props.selectedRecipe.recipeIngredients })
    this.props.recipeToUpdate && this.setState({ ingredientsAdded: this.props.recipeToUpdate.recipeIngredients })
  }  

  componentDidUpdate() {
    if(this.props.modalType === 'view'  && this.props.selectedRecipe.recipeIngredients != this.state.ingredientsAdded) {
      this.setState({ingredientsAdded: this.props.selectedRecipe.recipeIngredients})
    } 
  }

  openNewIngredientHandler = () => {
    this.setState({openNewIngredientDropdown: !this.state.openNewIngredientDropdown})
  }

  addIngredientHandler = (ingredientName, ingredientUnit, ingredientAmount, originalIngredientName) => {
    if(!originalIngredientName && this.state.ingredientsAdded.find(ingredient => ingredient.name === ingredientName)) {
      this.setState({ingredientValidation: true})
      setTimeout(()=>{
        this.setState({ingredientValidation: false})
      }, 3000)
    return
    }
    else {
      const ingredientObj = { 
        name: ingredientName,
        amount: +ingredientAmount,
        unit: ingredientUnit,
      }
     this.setState(prevState => {
       const updatedIngredients = originalIngredientName 
        ? [...prevState.ingredientsAdded.filter(ingredient => ingredient.name != originalIngredientName), ingredientObj] 
        : [...prevState.ingredientsAdded, ingredientObj]
       return {ingredientsAdded: updatedIngredients, openNewIngredientDropdown: false}
     })
    }
  }
  removeIngredientHandler = (e) => {
   let deleteSelectionName = e.currentTarget.id
     this.setState(prevState => {
       const updatedIngredients = prevState.ingredientsAdded.filter(ingredientObj => {
         return ingredientObj.name !== deleteSelectionName
        })
       return {ingredientsAdded: updatedIngredients, openNewIngredientDropdown: false}
     })
  }

  render() {
    return (
      <div className="modal__content_ingredients f fdc my1 mr2 ml0 ">
      <header className="modal__content_ingredients_header fw5 robo caps fw7 ls1 underline">Ingredients</header>
        <div className="yield-count f">
          <p className="pr025 m0 s14 fw5">Yields</p>
          {this.props.modalType === 'view'
          ? <input className="yield-count_amount s14 robo" type="number" onChange={this.yieldHandler} defaultValue={this.state.updatedYield} />
          : <input className="yield-count_amount s14 robo" type="number" onChange={this.yieldHandler} ref={this.props.yieldsEl} defaultValue={this.state.updatedYield} />
          }
        <p className="pl025 m0 s14 fw5 ls1">servings</p>
        </div>
      <ul ref = {this.props.recipeIngredientsEl} className="modal__content_ingredients-list f fdc pl1">
        {this.state.ingredientsAdded.map((ingredient, idx) => {
          return (
            this.props.modalType === 'update/create' 
            ? <IngredientEdit 
            yields={this.state.updatedYield} 
            ingredient={ingredient} 
            idx={idx}
            
            ingredientAmountEl = {this.props.ingredientAmountEl}
            ingredientUnitEl = {this.props.ingredientUnitEl}
            ingredientNameEl = {this.props.ingredientNameEl}
            ingredientValidation = {this.state.ingredientValidation}
            addIngredientHandler = {this.addIngredientHandler}
            removeIngredientHandler={this.removeIngredientHandler}
            /> 
            :  <Ingredient 
            yields={this.state.updatedYield} 
            ingredient={ingredient} 
            idx={idx}/> 
          )
        })}

        
      </ul>
      {this.props.modalType === 'update/create' && 
      <div className="add-new-ingredient_container">
        {
          this.state.openNewIngredientDropdown
          ? <IngredientEdit 
          yields={this.state.updatedYield} 
          
          ingredientAmountEl = {this.props.ingredientAmountEl}
          ingredientUnitEl = {this.props.ingredientUnitEl}
          ingredientNameEl = {this.props.ingredientNameEl}
          ingredientValidation = {this.state.ingredientValidation}
          addIngredientHandler = {this.addIngredientHandler}
          newIngredientAdder={this.state.openNewIngredientDropdown}
          openNewIngredientHandler = {this.openNewIngredientHandler}
          /> 
          : <div className="add-ingredient pointer"><p className="clg s12" onClick={this.openNewIngredientHandler}> add ingredient + </p></div>
        }
        
      
      </div>}
      
    </div>
      )
  }
  
}

export default Ingredients;