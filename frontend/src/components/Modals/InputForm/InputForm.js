import React, { Component } from 'react'
console.log('in input form')
class InputForm extends Component  {
  constructor(props) {
    super(props)
    this.state = {
      openIngredientDropdown: false,
      ingredientsAdded: [],
      addedSteps: []
    }

   
  }
  componentDidMount = () => {
    console.log('FOMR STATE; ', this.state)
  }

  componentDidUpdate = () => { 
    console.log('component did update: ', this.state.ingredientsAdded)
  }

  openIngredientHandler = () => {
    this.props.ingredientAmountEl.current.value = 1
    this.props.ingredientUnitEl.current.value = ''
    this.props.ingredientNameEl.current.value = ''
    this.setState({openIngredientDropdown: !this.state.openIngredientDropdown})
    
  }

  addIngredientHandler = (e) => {
    console.log('add ingredient')
     const ingredientObj = { 
       name: this.props.ingredientNameEl.current.value,
       amount: this.props.ingredientAmountEl.current.value,
       unit: this.props.ingredientUnitEl.current.value
     }
    this.setState(prevState => {
      console.log('prevState: ', prevState.ingredientsAdded)
     // console.log('ingredientObj: ', ingredientObj)
      const updatedIngredients = [...prevState.ingredientsAdded, ingredientObj]
      console.log('updatededIngredients: ', updatedIngredients)
      return {ingredientsAdded: updatedIngredients, openIngredientDropdown: false}
    })
    
  }
  render() {
    console.log('input form props: ', this.props)
    return (
      <form encType="multipart/form-data">
          <div className="form-control">
            <label htmlFor="recipeName">Recipe Name</label>
            <input ref={this.props.recipeNameEl} type="text" id="recipeName" defaultValue={this.props.recipeNameValue ? this.props.recipeNameValue : ""}/>
          </div>
          <div className="form-control">
            <label htmlFor="recipeDescription">Recipe Description</label>
            <textarea ref={this.props.recipeDescriptionEl} type="text" id="recipeDescription" rows="4" defaultValue={this.props.recipeDescriptionValue ? this.props.recipeDescriptionValue : ""}/>
          </div>
          <div className="form-control">
            <div className="recipeIngredients_header f">
              <label htmlFor="header"><b>Recipe Ingredients</b></label>
              <div className="add-recipe pointer" onClick={this.openIngredientHandler}>{this.state.openIngredientDropdown ? "Close x " : "Add Ingredient +"}</div>
            </div>
            
            <div ref={this.props.recipeIngredientsEl} >
              {this.state.ingredientsAdded && this.state.ingredientsAdded.map(ingredientObj => {
                  return (<p>{ingredientObj.amount} {ingredientObj.unit} - {ingredientObj.name}</p>)
              })}
            </div>

            <div className={`ingredientInputContainer bcbl ${this.state.openIngredientDropdown ? "" : "hidden"}`}>
              <div className="form-control">
                <label htmlFor="ingredientAmount">Amount</label>
                <input type="number" ref={this.props.ingredientAmountEl} id="ingredientAmount" defaultValue={this.props.recipeIngredientsValue ? this.props.recipeIngredientsValue : 1} />
              </div>
              <div className="form-control">
                <label htmlFor="ingredientUnit">Unit</label>
                <select defaultValue="cup" id="ingredientUnit" size="1" ref={this.props.ingredientUnitEl} >
                  
                  <option value="cup" >cup</option>
                  <option value="tbsp">tbsp</option>
                  <option value="tsp">tsp</option>
                  <option value="gram">gram</option>
                  <option value="ounce">ounce</option>
                  <option value="pound">pound</option>
                </select>
                
              </div>
              <div className="form-control">
                <label htmlFor="ingredientName">Ingredient Name</label>
                <input type="string" ref={this.props.ingredientNameEl} id="ingredientName" defaultValue={this.props.recipeIngredientsValue ? this.props.recipeIngredientsValue : ""} />
              </div>
              <div className="pointer" onClick={this.addIngredientHandler}>
                  Add
                </div>
            </div>
            
          </div>
          <div className="form-control">
            <label htmlFor="recipeSteps">Recipe Steps</label>
            <textarea ref={this.props.recipeStepsEl} type="text" id="recipeSteps" rows="4" defaultValue={this.props.recipeStepsValue ? this.props.recipeStepsValue : ""}/>
          </div>
          <div className="form-control">
            <label htmlFor="yields">Yields</label>
            <input ref={this.props.yieldsEl} type="number" id="yields" defaultValue={this.props.yields ? this.props.yields : 1} />
          </div>
          <div className="form-control">
            <label htmlFor="minutesEstimate">Estimated Minutes</label>
            <input ref={this.props.minutesEstimateEl} type="number" id="minutesEstimate" defaultValue={this.props.minutesEstimateValue ? this.props.minutesEstimateValue : 1} />
          </div>
          <div className="form-control">
            <label htmlFor="recipeLink">Recipe Link</label>
            <input ref={this.props.linkEl} type="url" id="recipeLink" defaultValue={this.props.linkValue ? this.props.linkValue : ""} />
          </div>
          <div className="form-control">
           <label>Upload your image</label>
           <input type="file" name="Recipe Image" id="recipeImage" />
          </div>
          <div className="form-control">
          <label htmlFor="imageUpload">Use Link Image (first image found)</label>
          <input ref={this.props.useLinkImageEl} type="checkbox" id="useLinkImage" defaultChecked={this.props.useLinkImage ? true : false} />
          </div>
        </form>
      )
  }
  
  
    
}

export default InputForm;