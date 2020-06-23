import React, { Component } from 'react'
import ClearIcon from '@material-ui/icons/Clear';
import './InputForm.scss'
import Ingredients from '../Ingredients/Ingredients';
import StepEdit from '../Steps/StepEdit'
import ImageEdit from '../ImagesList/ImageEdit'
class InputForm extends Component  {
  constructor(props) {
    super(props)
    this.state = {
      
      openStepsDropdown: false,
      viewing: 'description',
      stepsAdded: [],
      tagsAdded: [],
      imagesAdded: [],
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
      console.log('this.props.recipeToUpdate.imageLinks: ', this.props.recipeToUpdate.imageLinks.find(image => image.featured))
      await this.setState({
       ingredientsAdded: this.props.recipeToUpdate.recipeIngredients,
       stepsAdded: this.props.recipeToUpdate.recipeSteps.map((step, idx)=> {return{stepInstruction: step.stepInstruction, stepNumber: idx + 1 }}),
       imagesAdded: this.props.recipeToUpdate.imageLinks,
       showImageUploader: false,
       tagsAdded: this.props.recipeToUpdate.tags.map(tagObj => tagObj.tag),
       featuredImage: this.props.recipeToUpdate.imageLinks.find(image => image.featured)
     })
     
     console.log('this.state: ', this.state)
    } 
  }


viewHandler = e => {
  e.preventDefault()
  this.setState({viewing: e.target.id})
}

  openNewStepHandler = () => {
    this.setState({openStepsDropdown: !this.state.openStepsDropdown})
  }


  addStepHandler = (e) => { 
     this.setState(prevState => {
       const updatedSteps = [...prevState.stepsAdded, {stepNumber: prevState.stepsAdded.length+1, stepInstruction: this.props.recipeStepEl.current.value}]
       return {stepsAdded: updatedSteps.map((step, idx)=> {return{stepInstruction: step.stepInstruction, stepNumber: idx + 1 }}), openStepsDropdown: false}
     })
  }

  updateStepHandler = (originalStepInstruction, {updatedStepInstruction, stepNumber}) => {
      this.setState(prevState => {
        const updatedSteps = prevState.stepsAdded.map(step => {
         return step.stepInstruction === originalStepInstruction 
          ? {stepInstruction: updatedStepInstruction,
             stepNumber: stepNumber} 
          : step
        })
        return {stepsAdded: updatedSteps}
      })
  }

  removeStepHandler = (e) => {
   let deleteStepNumber = +e.currentTarget.id
     this.setState(prevState => {
       const updatedSteps = prevState.stepsAdded.filter(stepObj => stepObj.stepNumber !== deleteStepNumber)
       return {stepsAdded: updatedSteps.map((step, idx)=> {return{stepInstruction: step.stepInstruction, stepNumber: idx + 1 }}), openStepDropdown: false}
     })
  }

  openImageUpdater = () => {
    this.setState({showImageUploader: !this.state.showImageUploader})
  }

  toggleTagHandler = () => {
    this.setState({showTagAdder: !this.state.showTagAdder, tagSuggestions: []})
    this.props.newTagEl.current.value = ''
  }

  handleTagOnChange = (e) => {
    if(e.target.value.includes(" ")){
      this.props.newTagEl.current.value = this.props.newTagEl.current.value.replace(" ", '')
    } 
    let currentInput = e.target.value
    let recommendedTags = currentInput ? this.props.allTags.filter(tagObj => {
      return !this.state.tagsAdded.includes(tagObj.tag.toLowerCase()) && tagObj.tag.toLowerCase().includes(currentInput)
    }).map(tagObj => tagObj.tag) : []
    this.setState({tagSuggestions: recommendedTags})
  }

  submitTagHandler = (e) => {
    let newTag = e.target.classList.contains('tag-suggestion') ? e.target.dataset.suggestion : this.props.newTagEl.current.value
    this.setState(prevState => {
      if(!prevState.tagsAdded.includes(newTag)) {
        let updatedTags = [...prevState.tagsAdded, newTag]
        return {tagsAdded: updatedTags, showTagAdder: false, tagSuggestions: []}
      }
      else {
        alert ('Tag already exists on recipe')
      }
    })

    this.props.newTagEl.current.value = ''
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

  handleDeleteImage = imageId => {
    console.log('imageId', imageId)
    console.log('this.props from recipe to input: ', this.props)
    console.log('WHEN FEATURED IS REMOVED, WE MUST RESET FEATURED IMAGE')
    const updatedImages = this.state.imagesAdded.filter(image => image._id !== imageId)
    this.setState({imagesAdded: updatedImages})
    this.props.updateImageDeleteQueue(imageId)
  }

 

  render() {
    
    return (
      <form encType="multipart/form-data" className={`recipe-form ${this.props.recipeToUpdate ? 'update-recipe' : 'create-recipe'}`}>
      {this.props.recipeToUpdate && 
        <header className="modal__header main f jcb section-body">
            <div className="title f fdc x2 jcc rel">
            <p className="small s12 clg abs top mt0">Click on any field to edit</p>
              <div className="title-edit_container form-control">
                <textarea className="suiz fw6 f fw p0" ref={this.props.recipeNameEl} type="text" id="recipeName" defaultValue={this.props.recipeToUpdate ? this.props.recipeToUpdate.recipeName : ""}/>
              </div>
              <div className="time-edit_container form-control">
                <div className="f"><span className="">Time:</span> 
                  <input ref={this.props.minutesEstimateEl} type="number" id="minutesEstimate" className="mx025" defaultValue={this.props.recipeToUpdate ? this.props.recipeToUpdate.minutesEstimate : 1} /> 
                  {this.props.recipeToUpdate.minutesEstimate > 1 ? " mins" : ' min'}
                </div>
              </div>
            </div>
            <div className="featured-image">
              <img className="main-image" src={this.state.featuredImage ? this.state.featuredImage.link : null} alt='featured-image' />
            </div>
        </header>
        }
        <div className="modal__content f fw">
          <div className="desktop-only ingredients-container section-body form-control"> {/*Ingredients*/}
          <Ingredients
            ingredients = {this.props.recipeToUpdate ? this.props.recipeToUpdate.recipeIngredients : []} 
            recipeToUpdate={this.props.recipeToUpdate ? this.props.recipeToUpdate : null}
            yieldsEl = {this.props.yieldsEl}
            recipeIngredientsEl = {this.props.recipeIngredientsEl}
            ingredientAmountEl = {this.props.ingredientAmountEl}
            ingredientUnitEl = {this.props.ingredientUnitEl}
            ingredientNameEl = {this.props.ingredientNameEl}
            modalType="update/create"
            /> 
          </div>
          <div className="modal__content_main_container"> 
            <ul className="modal__content_main_nav f jcs pl0">
                <li className={`modal__content_main_nav_item pointer mr1 fw5 s12 fw7 ls1 caps ${this.state.viewing === "description" ? "active" : ""}`} id="description" onClick={this.viewHandler}>Description</li>
                <li className={`modal__content_main_nav_item pointer mr1 fw5 s12 fw7 ls1 caps ${this.state.viewing === "steps" ? "active" : ""}`} id="steps" onClick={this.viewHandler}>Steps</li>
                <li className={`modal__content_main_nav_item pointer mr1 fw5 s12 fw7 ls1 caps mobile-only ${this.state.viewing === "ingredients" ? "active" : ""}`} id="ingredients" onClick={this.viewHandler}>Ingredients</li>
                <li className={`modal__content_main_nav_item pointer mr1 fw5 s12 fw7 ls1 caps ${this.state.viewing === "images" ? "active" : ""}`} id="images" onClick={this.viewHandler}>Images</li>
                {/* <li className={`modal__content_main_nav_item pointer mr1 fw5 ${this.state.viewing === "creator-notes" ? "active" : ""}`} id="creator-notes" onClick={this.viewHandler}>Creator Notes</li> */}
            </ul>  
            <div className={`section-body description-container f fdc ${this.state.viewing === "description" ? '' : 'hidden'}`}> {/*Description*/}
              <section className="description">
                <p className="caps fw6 underline pb025">Overview</p>
                <textarea ref={this.props.recipeDescriptionEl} type="text" id="recipeDescription" rows="4" defaultValue={this.props.recipeToUpdate ? this.props.recipeToUpdate.recipeDescription : ""}/>
              </section>
          <div className="section-body link-container f fdc"> {/* Link */}
            <label htmlFor="recipeLink" className="caps fw6 underline pb025 s14 mb1">Original Recipe </label>
            <input ref={this.props.linkEl} type="url" id="recipeLink"  defaultValue={this.props.recipeToUpdate ? this.props.recipeToUpdate.link : ""} />
            <p className="advisory s12 clg">note: please make sure to double check the url</p>
          </div>
            <div className="section-body tag-container"> {/* Tags */}
              <div className="title-container f aic">
                <p className="caps fw6 underline pb025 mr05 "> Tags</p>
                <div className={`add-tag pointer clg s12 soft-btn_hover ${this.state.showTagAdder ? 'hidden' : ''}`} onClick={this.toggleTagHandler}>add tag + </div>
                <div className={`input-control f aic ${!this.state.showTagAdder ? 'hidden' : ''}`}>
                  <input type="text" ref={this.props.newTagEl} onChange={this.handleTagOnChange}/>
                    <div className="pointer mx05 clg s12 soft-btn_hover" onClick={this.submitTagHandler}>submit + </div>
                    <div className="pointer mr05 clg s12 soft-btn_hover" onClick={this.toggleTagHandler}>cancel x</div>
                  </div>
              </div>
                {this.state.tagSuggestions.length ? 
                <div className="tag-suggestions">
                  <p className=" clg s12  mt0">suggestions: </p>
                  <ul className="suggestion-list f p0" ref={this.tagSuggestionsEl}>
                    {this.state.tagSuggestions.map((suggestion, idx) => {
                      return <li className="tag tag-suggestion" onClick={this.submitTagHandler} key={idx} data-suggestion={suggestion}>{suggestion}</li>
                    })}
                  </ul>
                </div> : ""}
                <div className="tag-list f" ref={this.props.tagsEl}>
                  {this.state.tagsAdded.map(tag => {
                    return (<div className="tag mr05 f aic jcc bcbl" key={tag}>
                        <p className="pr025 cw">{tag}</p>
                        <div className="remove-tag pointer" data-value={tag} onClick={this.removeTagHandler}>X</div>
                        </div>)
                  })}
                </div>
              </div>
            </div>
            <div className={`section-body steps-container ${this.state.viewing === "steps" ? '' : 'hidden'}`}> {/* Recipe Steps */}
              <ul className="recipe-steps_list" ref={this.props.recipeStepsEl} >
                {this.state.stepsAdded && this.state.stepsAdded.map((step, idx) => {
                  return (
                    <StepEdit 
                    step={step} 
                    idx={idx} 
                    updateStepHandler = {this.updateStepHandler} 
                    removeStepHandler = {this.removeStepHandler}
                    recipeStepEl = {this.props.recipeStepEl}
                    />
                  )
                })}
              </ul>
              <div className={`recipeSteps_inputs bcbl ${this.state.openStepsDropdown ? "" : "hidden"}`}>
                <div className="section-body">
                  <label htmlFor="step-item">Step</label>
                  <input type="text" ref={this.props.recipeStepEl} id="stepItem" defaultValue={""} />
                </div>
                <div className="pointer" onClick={this.addStepHandler}> Add </div>
              </div>
              <div className="add-new-step_container">
                <div className="add-step pointer" onClick={this.openNewStepHandler}>
                  <p className="clg s12">{ "add step +"}</p>
                  </div>
              </div>
            </div>    
              <div className={`section-body images-container ${this.state.viewing === "images" ? '' : 'hidden'}`}>{/* Images */}
              <div className="image-uploader pointer"  >
                <p className="s12 soft-btn_hover" onClick={this.openImageUpdater}>{this.state.showImageUploader ? 'close x' : 'upload image +'}</p>
                { this.state.showImageUploader && 
                <div className="form-control">
                  <input type="file" multiple ref={this.imageFileInputEl} onChange={this.props.imageHandler}/>
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
                </div>
              <React.Fragment> 
              { this.props.recipeToUpdate &&
              <div className="form-control ">
                <div className="recipe-images f edit fw" ref={this.props.uploadedImagesEl}>
                  {this.state.imagesAdded && this.state.imagesAdded.map((imageLink, idx)=>{
                    return  (
                      <ImageEdit
                        idx = {idx}
                        imageLink = {imageLink}
                        featuredImage = {this.state.featuredImage}
                        handleDeleteImage = {this.handleDeleteImage}
                        handleFeaturedImage = {this.handleFeaturedImage}
                      />
                    //   <div className="uploaded-image f fdc aic rel mr025" data-featured={this.state.featuredImage === imageLink} key={idx}>
                    //     <div className="delete-image abs right" data-confirm={false} onClick={this.handleDeleteImage}>
                    //       {this.state.confirmDelete ? <div className="confirm-delete">Confirm Delete</div> : <ClearIcon />}
                    //     </div>
                    //     <div className="image-container f aic">
                    //       <img className="img" ref={this.props.uploadedImageEl} src={imageLink.link}/>
                    //     </div>
                    //     {this.state.featuredImage !== imageLink 
                    //     ? <div className="featured-image-control f aic">
                    //         <label htmlFor='featured-selection' className="select-featured caps small sl2">Set as featured</label>
                    //         <input type="radio" name="featured-selection" value={imageLink._id} onChange={this.handleFeaturedImage} checked={this.state.featuredImage === imageLink.link ? true : false }/>
                    //       </div>
                    //     : <div className="featured-label caps small sl2 abs">Featured</div>
                    //     }
                    // </div> 
                    )
                  })}
                </div> 
              </div> 
              }
            </React.Fragment>
            </div>
          </div>
        </div>
      </form>
    )
  }
}

export default InputForm;