import React, { Component } from 'react'
import './Ingredients.scss'
import ClearIcon from '@material-ui/icons/Clear';


class IngredientEdit extends Component {
state = {
  openIngredientEditor: false
}
  constructor(props){
    super(props)
  }

    openIngredientHandler = async () => {
      console.log('this.state.openIngredientEditor: ', this.state.openIngredientEditor)
      this.state.openIngredientEditor 
      ? await this.setState({openIngredientEditor: false})
      : await this.setState({openIngredientEditor: true})
      console.log('After this.state.openIngredientEditor: ', this.state.openIngredientEditor)
   }

    formatIngredientHandler = () => {
      console.log('this.props: ', this.props)
    this.props.addIngredientHandler(
      this.props.ingredientNameEl.current.value, 
      this.props.ingredientUnitEl.current.value, 
      this.props.ingredientAmountEl.current.value, 
      this.props.ingredient ? this.props.ingredient.name : null
    )
  }


  render() {
    this.props.ingredient && console.log('rerender: ', this.props.ingredient)
    return (
       <li key={this.props.idx} data-name={this.props.ingredient ? this.props.ingredient.name  : ''} data-amount={this.props.ingredient ? this.props.ingredient.amount : 1 } data-unit={this.props.ingredient ? this.props.ingredient.unit : 'cup' } className="ingredient-container f aic edit">


      <div className={`added-ingredient f ${this.state.openIngredientEditor || this.props.newIngredientAdder ? "hidden" : ""}`}>
        <p className={`ingredient-container_amount s14 caps`} >{parseFloat((this.props.ingredient ? this.props.ingredient.amount : 1).toFixed(2))} {this.props.ingredient ? this.props.ingredient.unit : 'cup'} - {this.props.ingredient ? this.props.ingredient.name: ''}</p>
        <div className="edit-ingredient edit pointer" onClick={this.openIngredientHandler}><p className="s12 clg mx05">edit</p></div>
        <div className="remove-ingredient edit pointer" id={this.props.ingredient ? this.props.ingredient.name : ''} onClick={this.props.removeIngredientHandler}><ClearIcon /></div>
      </div>

      
      <div className={`ingredientInputContainer mt05 ${this.state.openIngredientEditor  || this.props.newIngredientAdder ? "" : "hidden"}`}>
      <div className="form-control ingredient-amount">
        <label htmlFor="ingredientAmount" className="clg s12">amount</label>
        <input type="number" ref={this.props.ingredientAmountEl} id="ingredientAmount" defaultValue={this.props.ingredient ? this.props.ingredient.amount : 1} />
      </div>
      <div className="form-control ingredient-unit">
        <label htmlFor="ingredientUnit" className="clg s12">unit</label>
        <select id="ingredientUnit" size="1" ref={this.props.ingredientUnitEl} defaultValue={this.props.ingredient ? this.props.ingredient.unit : 'cup'}>
          <option value="cup">cup</option>
          <option value="tbsp">tbsp</option>
          <option value="tsp">tsp</option>
          <option value="gram">gram</option>
          <option value="ounce">ounce</option>
          <option value="pound">pound</option>
          <option value=""> </option>
        </select>
      </div>
      <div className="form-control ingredient-name">
        <label htmlFor="ingredientName" className="clg s12">ingredient name</label>
        <input type="string" ref={this.props.ingredientNameEl} id="ingredientName" defaultValue={this.props.ingredient ? this.props.ingredient.name : ''} />
        {this.props.ingredientValidation && <p className="caps cr">this ingredient already exists, choose a different name or delete exisiting ingredient</p>}
      </div>
      <div className="update-ingredient pointer "><p className="clg s12 mr05" onClick={this.formatIngredientHandler}> {this.props.ingredient ? "update +" : "add +"} </p></div>
      <div className="cancel-change pointer "><p className="cancel-change pointer clg s12 mr05" onClick={this.props.openNewIngredientHandler ? this.props.openNewIngredientHandler : this.openIngredientHandler }> {"cancel"} </p></div>
    </div>
    </li>
      )
  }
  
}

export default IngredientEdit;