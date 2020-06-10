import React, { Component } from 'react'
import Dropzone from 'react-dropzone';
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
    console.log('this.props: ', this.props)
    this.props.recipeToUpdate && 
    this.setState({
      ingredientsAdded: this.props.recipeToUpdate.recipeIngredients,
      stepsAdded: this.props.recipeToUpdate.recipeSteps.map((step, idx)=> {return{stepInstruction: step.stepInstruction, stepNumber: idx + 1 }}),
      updatedYield: this.props.recipeToUpdate.yields
    })
  }


  openIngredientHandler = () => {
    this.props.ingredientAmountEl.current.value = 1
    this.props.ingredientUnitEl.current.value = ''
    this.props.ingredientNameEl.current.value = ''
    this.setState({openIngredientDropdown: !this.state.openIngredientDropdown})
  }

  openStepsHandler = () => {
    this.setState({openStepsDropdown: !this.state.openStepsDropdown})
  }

  addIngredientHandler = (e) => {
    if(this.state.ingredientsAdded.find(ingredient => ingredient.name === this.props.ingredientNameEl.current.value)) {
      this.setState({ingredientValidation: true})
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
       const updatedIngredients = [...prevState.ingredientsAdded, ingredientObj]
       return {ingredientsAdded: updatedIngredients, openIngredientDropdown: false}
     })
    }
  }
  addStepHandler = (e) => { 
     this.setState(prevState => {
       const updatedSteps = [...prevState.stepsAdded, {stepNumber: prevState.stepsAdded.length+1, stepInstruction: this.props.recipeStepEl.current.value}]
       return {stepsAdded: updatedSteps.map((step, idx)=> {return{stepInstruction: step.stepInstruction, stepNumber: idx + 1 }}), openStepsDropdown: false}

     })
  }
  removeIngredientHandler = (e) => {
   let deleteSelectionName = e.target.id
     this.setState(prevState => {
       const updatedIngredients = prevState.ingredientsAdded.filter(ingredientObj => ingredientObj.name !== deleteSelectionName)
       return {ingredientsAdded: updatedIngredients, openIngredientDropdown: false}
     })
  }

  removeStepHandler = (e) => {
   let deleteStepNumber = +e.target.id
     this.setState(prevState => {
       const updatedSteps = prevState.stepsAdded.filter(stepObj => stepObj.stepNumber !== deleteStepNumber)
       return {stepsAdded: updatedSteps.map((step, idx)=> {return{stepInstruction: step.stepInstruction, stepNumber: idx + 1 }}), openStepDropdown: false}
     })
  }


  render() {
    return (
      <form encType="multipart/form-data">
        <div className="form-control">
          <label htmlFor="recipeName">Recipe Name</label>
          <input ref={this.props.recipeNameEl} type="text" id="recipeName" defaultValue={this.props.recipeToUpdate ? this.props.recipeToUpdate.recipeName : ""}/>
        </div>
        <div className="form-control">
          <label htmlFor="recipeDescription">Recipe Description</label>
          <textarea ref={this.props.recipeDescriptionEl} type="text" id="recipeDescription" rows="4" defaultValue={this.props.recipeToUpdate ? this.props.recipeToUpdate.recipeDescription : ""}/>
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
              <input type="number" ref={this.props.ingredientAmountEl} id="ingredientAmount" defaultValue="1" />
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
              <input type="string" ref={this.props.ingredientNameEl} id="ingredientName" defaultValue={""} />
              {this.state.ingredientValidation && <p className="caps cr">this ingredient already exists, choose a different name or delete exisiting ingredient</p>}
            </div>
            <div className="pointer" onClick={this.addIngredientHandler}>
                Add
              </div>
          </div>
        </div>

          {/* Recipe Steps */}
        <div className="form-control">
          <div className="recipeIngredients_header f">
            <label htmlFor="recipeSteps"><b>Recipe Steps</b></label>
            <div className="add-recipe pointer" onClick={this.openStepsHandler}>{this.state.openStepsDropdown ? "Close x " : "Add Step +"}</div>
          </div>
          <ul className="recipeSteps_container" ref={this.props.recipeStepsEl} >
            {this.state.stepsAdded && this.state.stepsAdded.map((step, idx) => {
              return (
                <li className="step-list_item f" key={idx}>
                  <div className="remove-item pointer" id={step.stepNumber} onClick={this.removeStepHandler}>X</div>
                  <p><span className="step-order">{step.stepNumber}.</span> <span className="step-content">{step.stepInstruction}</span></p>
                </li> 
              )
            })}
          </ul>

          <div className={`recipeSteps_inputs bcbl ${this.state.openStepsDropdown ? "" : "hidden"}`}>
            <div className="form-control">
              <label htmlFor="step-item">Step</label>
              <input type="text" ref={this.props.recipeStepEl} id="stepItem" defaultValue={""} />
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
          <input ref={this.props.minutesEstimateEl} type="number" id="minutesEstimate" defaultValue={this.props.recipeToUpdate ? this.props.recipeToUpdate.minutesEstimate : 1} />
        </div>
        <div className="form-control">
          <label htmlFor="recipeLink">Recipe Link</label>
          <input ref={this.props.linkEl} type="url" id="recipeLink" defaultValue={this.props.recipeToUpdate ? this.props.recipeToUpdate.link : ""} />
        </div>
        <div className="form-control">
          <label>Upload your image</label>
          <input type="file" onChange={this.props.imageHandler}/>
          {/* <Dropzone onDrop={acceptedFiles => this.props.imageHandler(acceptedFiles)}>
            {({getRootProps, getInputProps}) => (
              <section>
                <div {...getRootProps()}>
                  <input {...getInputProps()} />
                  <p>Drag 'n' drop some files here, or click to select files</p>
                </div>
              </section>
            )}
          </Dropzone> */}
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