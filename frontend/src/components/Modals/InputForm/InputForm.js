import React, { Component } from 'react'
console.log('in input form')
class InputForm extends Component  {
  constructor(props) {
    super(props)
    this.state = {
      openIngredientDropdown: false,
      openStepsDropdown: false,
      ingredientsAdded: [],
      stepsAdded: [],
      ingredientValidation: false,

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

  openStepsHandler = () => {
    // this.props.ingredientAmountEl.current.value = 1
    // this.props.ingredientUnitEl.current.value = ''
    // this.props.ingredientNameEl.current.value = ''
    this.setState({openStepsDropdown: !this.state.openStepsDropdown})
  }

  addIngredientHandler = (e) => {
    console.log('add ingredient')
    if(this.state.ingredientsAdded.find(ingredient => ingredient.name === this.props.ingredientNameEl.current.value)) {
      this.setState({ingredientValidation: true})
      console.log('INGREDIENT WITH THIS NAME ALREADY ADDED')
      setTimeout(()=>{
        this.setState({ingredientValidation: false})
      }, 3000)
    
    return
    }
    else {
      const ingredientObj = { 
        name: this.props.ingredientNameEl.current.value,
        amount: this.props.ingredientAmountEl.current.value,
        unit: this.props.ingredientUnitEl.current.value,
      }
     this.setState(prevState => {
       console.log('prevState: ', prevState.ingredientsAdded)
       const updatedIngredients = [...prevState.ingredientsAdded, ingredientObj]
       console.log('updatededIngredients: ', updatedIngredients)
       return {ingredientsAdded: updatedIngredients, openIngredientDropdown: false}
     })
    }
  }

  addStepHandler = (e) => {
    console.log('add step')
  
     
     this.setState(prevState => {
       console.log('prevState: ', prevState.stepsAdded)
       const updatedSteps = [...prevState.stepsAdded, this.props.recipeStepEl.current.value]
       console.log('updatededIngredients: ', updatedSteps)
       return {stepsAdded: updatedSteps, openStepsDropdown: false}
     })
    
  }

  removeIngredientHandler = (e) => {
    console.log('remove ingredient: ', e.target.id)
   let deleteSelectionName = e.target.id
     this.setState(prevState => {
       console.log('prevState: ', prevState.ingredientsAdded)
       const updatedIngredients = prevState.ingredientsAdded.filter(ingredientObj => ingredientObj.name !== deleteSelectionName)
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

            {/* Ingredients List */}
            
            <ul className="ingredient-list" ref={this.props.recipeIngredientsEl} >
              {this.state.ingredientsAdded && this.state.ingredientsAdded.map((ingredientObj, idx) => {
                  return (
                  <li className="ingredient-list_item f" key={idx}>
                    <div className="remove-item pointer" id={ingredientObj.name} onClick={this.removeIngredientHandler}>X</div>
                    <p><span data-amount={ingredientObj.amount}>{ingredientObj.amount}</span> <span data-unit={ingredientObj.unit}>{ingredientObj.unit}</span> - <span data-name={ingredientObj.name}>{ingredientObj.name}</span></p>
                    </li> 
                  )
              })}
            </ul>

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
                {this.state.ingredientValidation && <p className="caps cr">this ingredient already exists, choose a different name or delete exisiting ingredient</p>}
              </div>
              <div className="pointer" onClick={this.addIngredientHandler}>
                  Add
                </div>
            </div>
          </div>
            {/* Recipe Steps */}
            
          <div className="form-control">
            <label htmlFor="recipeSteps">Recipe Steps</label>
            <div className="add-recipe pointer" onClick={this.openStepsHandler}>{this.state.openStepsDropdown ? "Close x " : "Add Step +"}</div>
            <ul className="recipeSteps_container" ref={this.props.recipeStepsEl} >
              {this.state.stepsAdded && this.state.stepsAdded.map((step, idx) => {
                  return (
                  <li className="step-list_item f" key={idx}>
                    <div className="remove-item pointer" id={idx} onClick={this.removeStepHandler}>X</div>
                    <p><span className="step-order">{idx + 1}.</span> <span className="step-content">{step}</span></p>
                    </li> 
                  )
              })}
            </ul>

            <div className={`recipeSteps_inputs bcbl ${this.state.openStepsDropdown ? "" : "hidden"}`}>
              <div className="form-control">
                <label htmlFor="step-item">Step</label>
                <input type="text" ref={this.props.recipeStepEl} id="stepItem" defaultValue={this.props.recipeStep ? this.props.recipeStep : ""} />
              </div>
              <div className="pointer" onClick={this.addStepHandler}>
                  Add
                </div>
            </div>
          </div>


          <div className="form-control">
            <label htmlFor="yields">Yields</label>
            <input ref={this.props.yieldsEl} type="number" id="yields" defaultValue={this.state.updatedYield} />
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