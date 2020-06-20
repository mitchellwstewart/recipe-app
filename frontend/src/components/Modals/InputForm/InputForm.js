import React, { Component } from 'react'
import ClearIcon from '@material-ui/icons/Clear';
import './InputForm.scss'
class InputForm extends Component  {
  constructor(props) {
    super(props)
    this.state = {
      openIngredientDropdown: false,
      openStepsDropdown: false,
      ingredientsAdded: [],
      stepsAdded: [],
      tagsAdded: [],
      ingredientValidation: false,
      showImageUploader: true,
      showTagAdder: false,
      tagSuggestions: [],
      featuredImage: null,
      confirmDelete: false,
    }


    this.tagSuggestionsEl = React.createRef();
    this.imageFileInputEl = React.createRef();
  }
  componentDidMount = async () => {
    if(this.props.recipeToUpdate) {
      await this.setState({
       ingredientsAdded: this.props.recipeToUpdate.recipeIngredients,
       stepsAdded: this.props.recipeToUpdate.recipeSteps.map((step, idx)=> {return{stepInstruction: step.stepInstruction, stepNumber: idx + 1 }}),
       updatedYield: this.props.recipeToUpdate.yields,
       showImageUploader: false,
       tagsAdded: this.props.recipeToUpdate.tags.map(tagObj => tagObj.tag ),
       featuredImage: this.props.recipeToUpdate.imageLinks.find(image => image.featured === true)
     })
    } 
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

  openImageUpdater = () => {
    this.setState({showImageUploader: !this.state.showImageUploader})
  }

  addTagHandler = () => {
    this.setState({showTagAdder: !this.state.showTagAdder})
  }

  handleTagOnChange = (e) => {
    
    if(e.target.value.includes(" ")){
      this.props.newTagEl.current.value = this.props.newTagEl.current.value.replace(" ", '')
    } 
    let currentInput = e.target.value
    let recommendedTags = currentInput ? this.props.allTags.filter(tagObj => tagObj.tag.toLowerCase().includes(currentInput)).map(tagObj => tagObj.tag) : []
    this.setState({tagSuggestions: recommendedTags})
  }

  submitTagHandler = (e) => {
    let newTag = e.target.classList.contains('tag-suggestion') ? e.target.dataset.suggestion : this.props.newTagEl.current.value
    this.setState(prevState => {
      if(!prevState.tagsAdded.includes(newTag)) {
        let updatedTags = [...prevState.tagsAdded, newTag]
        return {tagsAdded: updatedTags, showTagAdder: false}
      }
      else {
        alert ('Tag already exists on recipe')
      }
    })
  }

  removeTagHandler = (e) => {
    const tagToRemove = e.target.dataset.value
    this.setState(prevState => {
      return{tagsAdded: prevState.tagsAdded.filter(tag => tag !== tagToRemove)}
    })
  }

  handleFeaturedImage = (e) => {
    let selectedImageObj = this.props.recipeToUpdate.imageLinks.find(image => image._id === e.target.value)
    this.setState({featuredImage: selectedImageObj})
  }

  removeFromQueue = e => {
    this.imageFileInputEl.current.value = ''
    this.props.removeFromQueue(e)
  }

  handleDeleteImage = e => {
    console.log('handle delete: ', e.currentTarget.dataset.confirm)
    let imageForDeletion = e.currentTarget
    if(imageForDeletion.dataset.confirm) {
      console.log('remove this image from images')
      e.currentTarget.dataset.state = true
    }
    else {
      imageForDeletion.dataset.confirm = true
    }
  }

 

  render() {
    this.props.recipeToUpdate && console.log('recipeToUpdate: ', this.props.recipeToUpdate)
    return (
      <form encType="multipart/form-data" className={`recipe-form ${this.props.recipeToUpdate ? 'update-recipe' : 'create-recipe'}`}>

      {this.props.recipeToUpdate && 
        <header className="modal__header main f jcb ">
            <div className="title f fdc x2 jcc">
              <div className="title-edit_container form-control"><textarea className="suiz fw6 f fw" ref={this.props.recipeNameEl} type="text" id="recipeName" defaultValue={this.props.recipeToUpdate ? this.props.recipeToUpdate.recipeName : ""}/><p className="small s12 underline pointer">edit name</p></div>
              <div className="time-edit_container form-control"><div className="f"><span className="pr025">Time:</span> <input ref={this.props.minutesEstimateEl} type="number" id="minutesEstimate" className="pr025" defaultValue={this.props.recipeToUpdate ? this.props.recipeToUpdate.minutesEstimate : 1} />{this.props.recipeToUpdate.minutesEstimate > 1 ? " mins" : ' min'}</div><p className="small s12 underline pointer">edit time</p></div>
            </div>
            <div className="featured-image">
              <img className="main-image" src={this.props.recipeToUpdate.imageLinks.find(img => img.featured).link} />
            </div>
        </header>
        }
        {/* <div className="form-control">
          <label htmlFor="recipeName">Recipe Name</label>
          <input ref={this.props.recipeNameEl} type="text" id="recipeName" defaultValue={this.props.recipeToUpdate ? this.props.recipeToUpdate.recipeName : ""}/>
        </div>
        <div className="form-control">
          <label htmlFor="minutesEstimate">Estimated Minutes</label>
          <input ref={this.props.minutesEstimateEl} type="number" id="minutesEstimate" defaultValue={this.props.recipeToUpdate ? this.props.recipeToUpdate.minutesEstimate : 1} />
        </div> */}
      
        <div className="form-control"> {/*Ingredients*/}
          <div className="recipeIngredients_header f">
            <label htmlFor="header"><b>Recipe Ingredients</b></label> 
            <div className="add-recipe pointer" onClick={this.openIngredientHandler}>{this.state.openIngredientDropdown ? "Close x " : "Add Ingredient +"}</div>
          </div>
          <div className="form-control">
            <label htmlFor="yields">Yields</label>
            <input ref={this.props.yieldsEl} type="number" id="yields" defaultValue={this.state.updatedYield} />
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
              <select id="ingredientUnit" size="1" ref={this.props.ingredientUnitEl} defaultValue="cup">
                <option value="cup">cup</option>
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
        <div className="form-control"> {/*Description*/}
          <label htmlFor="recipeDescription">Recipe Description</label>
          <textarea ref={this.props.recipeDescriptionEl} type="text" id="recipeDescription" rows="4" defaultValue={this.props.recipeToUpdate ? this.props.recipeToUpdate.recipeDescription : ""}/>
        </div>
        <div className="form-control"> {/* Recipe Steps */}
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
        <div className="form-control"> {/* Link */}
          <label htmlFor="recipeLink">Recipe Link</label>
          <input ref={this.props.linkEl} type="url" id="recipeLink" defaultValue={this.props.recipeToUpdate ? this.props.recipeToUpdate.link : ""} />
        </div>
        <React.Fragment> {/* Images */}
        { this.props.recipeToUpdate &&
        <div className="form-control">
          <label>Images</label>
          <div className="recipe-images f edit" ref={this.props.uploadedImagesEl}>
            {this.props.recipeToUpdate.imageLinks && this.props.recipeToUpdate.imageLinks.map((imageLink, idx)=>{
              return  (
                  <div className="uploaded-image f fdc aic rel mr025" data-featured={this.state.featuredImage === imageLink} key={idx}>
                    <div className="delete-image abs right" data-confirm={false} onClick={this.handleDeleteImage}>
                      {this.state.confirmDelete ? <div className="confirm-delete">Confirm Delete</div> : <ClearIcon />}
                    </div>
                    <div className="image-container f aic">
                      <img className="img" ref={this.props.uploadedImageEl} src={imageLink.link}/>
                    </div>
                    {this.state.featuredImage !== imageLink 
                    ? <div className="featured-image-control f aic">
                        <label htmlFor='featured-selection' className="select-featured caps small sl2">Set as featured</label>
                        <input type="radio" name="featured-selection" value={imageLink._id} onChange={this.handleFeaturedImage} checked={this.state.featuredImage === imageLink.link ? true : false }/>
                      </div>
                    : <div className="featured-label caps small sl2 abs">Featured</div>
                    }
                </div>
                )
            })}
          </div> 
        </div> 
        }
         <div className="edit-image pointer"  onClick={this.openImageUpdater}>{this.state.showImageUploader ? 'Close X' : 'Upload Image'}</div>
          { this.state.showImageUploader && 
          <div className="form-control">
            <input type="file" ref={this.imageFileInputEl} onChange={this.props.imageHandler}/>
            {this.props.imageUploadQueue.length > 0 && 
            <div className="upload-queue" >
              <p>Ready For Upload</p>
              <div className="images-for-upload f fdc">
                {this.props.imageUploadQueue.map(image => {
                  return (<div className="p0 m0 f" key={image.name}>- {image.name} <div className="clear-file f aic pointer" data-image={image.name} onClick={this.removeFromQueue}><ClearIcon /></div></div>)
                })}
              </div>
            </div>
            }
          </div>     
          }
      </React.Fragment>
        <div className="fomr-control tag-container"> {/* Tags */}
          <p className="fw6"> Tags: </p>
          <div className="tag-list f" ref={this.props.tagsEl}>
            {this.state.tagsAdded.map(tag => {
              return (<div className="recipe-tag mr05 f aic jcc bcbl" key={tag}>
                  <p className="pr025">{tag}</p>
                  <div className="remove-tag pointer" data-value={tag} onClick={this.removeTagHandler}>X</div>
                  </div>)
            })}
          </div>
          <div className="add-tag pointer" onClick={this.addTagHandler}>ADD TAG</div>
            <div className={!this.state.showTagAdder ? 'hidden' : ''}>
              <input type="text" ref={this.props.newTagEl} onChange={this.handleTagOnChange}/>
              <div className="pointer" onClick={this.submitTagHandler}>Submit</div>
              {this.state.tagSuggestions.length ? 
              <div className="tag-suggestions">
              <p>Tag Suggestions</p>
              <ul ref={this.tagSuggestionsEl}>
                {this.state.tagSuggestions.map((suggestion, idx) => {
                  return <li className="tag-suggestion" onClick={this.submitTagHandler} key={idx} data-suggestion={suggestion}>{suggestion}</li>
                })}
              </ul>
            </div> : ""}
          </div>
        </div>
      </form>
    )
  }
}

export default InputForm;