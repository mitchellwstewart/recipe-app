
import React, { Component } from 'react';
import './Recipes.scss';
import ViewModal from '../components/Modals/ViewRecipe/ViewRecipe';
import CreateAndUpdateModal from '../components/Modals/CreateAndUpdateRecipe/CreateAndUpdateRecipe';
import InputForm from '../components/Modals/InputForm/InputForm';
import Backdrop from '../components/Backdrop/Backdrop'
import AuthContext from '../context/auth-context'
import RecipeList from '../components/Recipes/RecipeList/RecipeList'
import Spinner from '../components/Spinner/Spinner'
import {createRecipeMutation, updateRecipeMutation, fetchRecipesQuery} from '../graphqlQueries/queries'
import axios from 'axios'
require('dotenv').config()

class RecipesPage extends Component {
  state = {
    creating: false,
    updating: false,
    recipes: [],
    recipesInSearch: [],
    searchBy: 'name',
    isLoading: false,
    selectedRecipe: null,
    recipeToUpdate: null,
    validationError: false,
    imageFile: null,
    imageUploadQueue: [],
    allTags: []
  }

  isActive = true

  static contextType = AuthContext
  constructor(props) {
    super(props);
    this.recipeNameEl = React.createRef();
    this.recipeDescriptionEl = React.createRef();
    this.recipeIngredientsEl = React.createRef();
    this.recipeStepsEl = React.createRef();
    this.recipeStepEl = React.createRef();
    this.minutesEstimateEl = React.createRef();
    this.yieldsEl = React.createRef();
    this.dateEl = React.createRef();
    this.linkEl = React.createRef();
    this.ingredientAmountEl = React.createRef();
    this.ingredientUnitEl = React.createRef();
    this.ingredientNameEl = React.createRef();
    this.imageEl = React.createRef();
    this.uploadedImagesEl = React.createRef()
    this.tagsEl = React.createRef();
    this.newTagEl = React.createRef();
    this.searchBarEl = React.createRef()
    this.searchByEl = React.createRef()
  }

  componentDidMount(){
    this.fetchRecipes()
    console.log(this.context)
  }

  startCreateOrUpdateRecipeHandler = (args) => {
    args === 'update'
      ? this.setState(prevState => {
        return {updating: true, recipeToUpdate: prevState.selectedRecipe}
      })
    : this.setState({creating: true})
  }

  modalCancelHandler = (args) => {
    this.setState({creating: false, selectedRecipe: null, updating: false, recipeToUpdate: false})
  }

  modalConfirmHandler = async () => {
    console.log('context: ', this.context)
    const recipeName = this.recipeNameEl.current.value
    const recipeDescription = this.recipeDescriptionEl.current.value
    const recipeIngredients = Array.from(this.recipeIngredientsEl.current.children).map(ingredientNode => {
      const ingredientName = ingredientNode.querySelector('[data-name]').dataset.name
      const ingredientAmount = +ingredientNode.querySelector('[data-amount]').dataset.amount
      const ingredientUnit = ingredientNode.querySelector('[data-unit]').dataset.unit
      return { name: ingredientName, amount: ingredientAmount, unit: ingredientUnit}
    })
    const recipeSteps = Array.from(this.recipeStepsEl.current.children).map((stepNode, idx) => {
      const stepNumber = +(idx+1)
      const stepInstruction = stepNode.querySelector('span.step-content').innerText
        return {stepNumber: stepNumber, stepInstruction: stepInstruction}
    })
    
    const tags = Array.from(this.tagsEl.current.children).map(tagNode => {
      const tag = tagNode.querySelector('p').innerText
      return {tag: tag}
    })
    const currentRecipeImages = this.uploadedImagesEl.current ? Array.from(this.uploadedImagesEl.current.children).map(uploadedImage => {return uploadedImage.src}) : []
    const yields = +this.yieldsEl.current.value
    const minutesEstimate = +this.minutesEstimateEl.current.value
    const link = this.linkEl.current.value
    const recipeImagesQueue = this.state.imageUploadQueue

    let newImageLinks = [];
         try {
           if(recipeImagesQueue.length) {
            const imageUploaders = await recipeImagesQueue.map(image => {
              const formData = new FormData();
              formData.append('file', image)
              formData.append('upload_preset', process.env.REACT_APP_UPLOAD_PRESET)
              return axios({
                url: process.env.REACT_APP_IMAGE_UPLOAD_URL,
                method: "POST",
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: formData
              }).then(res => {
                if(res.status !== 200 && res.status !== 201) {
                  throw new Error('Failed!')
                }
                newImageLinks.push(res.data.secure_url)
              })
            })
            await axios.all(imageUploaders).then((res)=>{
              this.setState({imageUploadQueue: []})
            })
           }
         if(
           recipeName.trim().length === 0 ||
           recipeIngredients.length === 0 ||
           recipeSteps.length === 0 ||
           yields <= 0 || 
           minutesEstimate <= 0 
         ){
           this.setState({validationError: true})
           setTimeout(()=> {
             this.setState({validationError: false})
           }, 3000)
           return;
         }
         
          const recipeId = this.state.updating ? this.state.recipeToUpdate._id : null
          const defaultVariables = {
            recipeName: recipeName,
            recipeDescription: recipeDescription,
            recipeIngredients: recipeIngredients,
            recipeSteps: recipeSteps,
            yields: yields,
            minutesEstimate: minutesEstimate,
            date: new Date().toISOString(),
            link: link,
            imageLinks: newImageLinks.length ? [...currentRecipeImages, ...newImageLinks] : currentRecipeImages,
            tags: tags,
          }

          const updatedVariables = recipeId ? {...defaultVariables, recipeId} : defaultVariables
           const requestBody = {
             query: this.state.updating ? updateRecipeMutation : createRecipeMutation,
             variables: updatedVariables
           };
          const token = this.context.token;
          const mongoRes = await fetch('http://localhost:3001/graphql', {
               method: 'POST',
               body: JSON.stringify(requestBody),
               headers: {
                 'Content-Type': 'application/json',
                 'Authorization': 'Bearer ' + token
               }
             })
               if(mongoRes.status !== 200 && mongoRes.status !== 201) {
                 throw new Error('Failed!')
               }
              const resData =  await mongoRes.json()
              console.log("resData from create/update: ", resData)
              if(this.state.creating) {
                this.setState(prevState => {
                  const updatedRecipes = [...prevState.recipes]
                  const previousAllTags = {}
                  prevState.allTags.forEach(tagObj => previousAllTags[tagObj.tag] = tagObj)
                  const updatedAllTags = resData.data.createRecipe.tags.filter(newTag => !previousAllTags[newTag.tag] && newTag );
                  updatedRecipes.push({
                    _id: resData.data.createRecipe._id,
                    recipeName: resData.data.createRecipe.recipeName,
                    recipeDescription: resData.data.createRecipe.recipeDescription,
                    recipeIngredients: resData.data.createRecipe.recipeIngredients,
                    recipeSteps: resData.data.createRecipe.recipeSteps,
                    yields: resData.data.createRecipe.yields,
                    minutesEstimate: resData.data.createRecipe.minutesEstimate,
                    date: resData.data.createRecipe.date,
                    link: resData.data.createRecipe.link,
                    imageLinks: resData.data.createRecipe.imageLinks,
                    tags: resData.data.createRecipe.tags,
                    creator: {
                      _id: this.context.userId,
                    }
                  })
                  return {recipes: updatedRecipes, recipesInSearch: updatedRecipes, selectedRecipe: {...resData.data.createRecipe,creator: {_id: this.context.userId}, allTags: updatedAllTags }}
                })
                this.searchBarEl.current.value = ""
              }
              else if (this.state.updating) {
                this.setState(prevState => {
                  const updatedRecipe = {...resData.data.updateRecipe, creator: {_id: prevState.recipeToUpdate.creator._id}}
                  const updatedRecipes = [...prevState.recipes.filter(recipe => recipe._id !== resData.data.updateRecipe._id), updatedRecipe]
                  const previousAllTags = {}
                  prevState.allTags.forEach(tagObj => previousAllTags[tagObj.tag] = tagObj) 
                  const updatedAllTags = resData.data.updateRecipe.tags.filter(newTag => !previousAllTags[newTag.tag] && newTag );
                  return {recipes: updatedRecipes, recipesInSearch: updatedRecipes, recipeToUpdate: null, selectedRecipe: updatedRecipe, updating: false, allTags: updatedAllTags}
                })
                this.searchBarEl.current.value = ""
              } 
              
            this.setState({creating: false, updating: false})   
         }
         catch(err) {
           throw err
         }
     
  }

  modalSubscribeToRecipeHandler = () => {
    if(!this.context.token) {
      this.setState({selectedRecipe: null})
      return;
    }
    const requestBody = {
      query: `
        mutation SubscripeToRecipe ($id: ID!) {
          subscribeToRecipe(recipeId: $id){
            _id
            createdAt
            updatedAt
          }
        }
      `,
      variables: {
        id: this.state.selectedRecipe._id
      }
    }
  
    fetch('http://localhost:3001/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.context.token
      }
      }).then(res => {
        if(res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!')
        }
        return res.json()
      }).then(resData => {
        this.setState({selectedRecipe: null})
      })
      
      .catch(err => {
        throw err
    })
  }

  modalDeleteRecipeHandler = () => {
    if(!this.context.token) {
      this.setState({selectedRecipe: null})
      return;
    }
    
    const requestBody = {
      query: `
        mutation DeleteRecipe ($id: ID!) {
          deleteRecipe(recipeId: $id){
            _id
          }
        }
      `,
      variables: {
        id: this.state.selectedRecipe._id
      }
    }
    fetch('http://localhost:3001/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.context.token
      }
      }).then(res => {
        if(res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!')
        }
        return res.json()
      }).then(resData => {
        
        this.setState(prevState => {
          return {creating: false, selectedRecipe: null, recipes: prevState.recipes.filter(recipe => recipe._id !== resData.data.deleteRecipe._id)}
        })

        this.setState({recipesInSearch: this.state.recipes})
        this.searchBarEl.current.value = ""
      })
      .catch(err => {
        throw err
      })
  }


  showDetailHandler = recipeId => {
    this.setState(prevState => {
      const selectedRecipe = prevState.recipes.find(recipe => recipe._id === recipeId)
      return { selectedRecipe: selectedRecipe }
    })
  }

  imageUploadHandler = e => {
    const imageForUpload = e.target.files[0]
    
    this.setState(prevState => {
      return {imageUploadQueue: [imageForUpload, ...prevState.imageUploadQueue]}
    })
  }

  handleSearch = e => {
    let currentSearch = e.target.value
    this.setState(prevState => {
      let newSearchedRecipes = prevState.recipes.filter(recipe => {
        return this.searchByEl.current.value.trim() === 'user'
        ? recipe.creator.email.toLowerCase().includes(currentSearch.toLowerCase())
        : recipe.recipeName.toLowerCase().includes(currentSearch.toLowerCase())
        
        
      })
      return {recipesInSearch: newSearchedRecipes}
    })
  }



  handleTagSelection = e => {
    console.log('this.state: ', this.state)
    if(e.target.dataset.clear) {
      this.setState({recipesInSearch: this.state.recipes})
    }
    else {
      
      const recipesWithTag = this.state.recipes.filter(recipe => {
        let recipeHasTag = false
        recipe.tags.forEach(tag => { if(tag.tag === e.target.innerText) recipeHasTag = true })
        if(recipeHasTag) return recipe
      })
      console.log('recipesWithTag: ', recipesWithTag)
      this.setState({recipesInSearch: recipesWithTag})
    }
    console.log('e.target.value: ', e.target.dataset.clear)
    console.log('e.target.value: ', e.target.innerText)
  }

  fetchRecipes() {
    this.setState({isLoading: true})
    const requestBody = { query: fetchRecipesQuery }
    const token = this.context.token;
      fetch('http://localhost:3001/graphql', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        }
      }).then(res => {
        
        if(res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!')
        }
        return res.json()
      }).then(resData => {
        console.log("resData: ", resData)
        const recipes = resData.data.recipes
        const tags = resData.data.tags
        if(this.isActive) {
          this.setState({recipes: recipes, isLoading: false, recipesInSearch: recipes, allTags: tags})
        }
      })
      .catch(err => {
        this.setState({isLoading: false})
        throw err
      })
  }


  componentWillUnmount = () => {
    this.isActive = false
  }



  render() {
    return(
      <React.Fragment>
        {(this.state.creating || this.state.updating || this.state.selectedRecipe) && <Backdrop />}
        {this.state.creating && 
        (
        <CreateAndUpdateModal title="Add New" 
        //in this case, the options is confrim only (always owner)
        canCancel 
        canConfirm 
        isCreate
        confirmText="Confirm"
        onCancel={this.modalCancelHandler} 
        onConfirm={this.modalConfirmHandler}
        validationError={this.state.validationError}
        >
          <InputForm 
          recipeNameEl={this.recipeNameEl} 
          dateEl={this.dateEl} 
          linkEl={this.linkEl} 
          minutesEstimateEl={this.minutesEstimateEl}
          yieldsEl={this.yieldsEl}
          recipeDescriptionEl={this.recipeDescriptionEl} 
          recipeIngredientsEl={this.recipeIngredientsEl} 
          recipeStepsEl={this.recipeStepsEl}
          recipeStepEl={this.recipeStepEl}
          ingredientAmountEl={this.ingredientAmountEl}
          ingredientUnitEl={this.ingredientUnitEl}
          ingredientNameEl={this.ingredientNameEl}
          imageEl = {this.imageEl}
          imageUploadQueue = {this.state.imageUploadQueue}
          imageHandler = {this.imageUploadHandler}
          tagsEl = {this.tagsEl}
          newTagEl = {this.newTagEl}
          allTags={this.state.allTags}
          />
        </CreateAndUpdateModal>)}
        {this.state.selectedRecipe && 
        //in this case, the options are delete, edit(if owner) or subscribe(if visitor)
          (<ViewModal 
          title={this.state.selectedRecipe.recipeName} 
          canCancel 
          canSubscribe = {this.context.userId !== this.state.selectedRecipe.creator._id ? true : false} 
          canEdit = {this.context.userId !== this.state.selectedRecipe.creator._id ? false : true}
          canDelete = {this.context.userId !== this.state.selectedRecipe.creator._id ? false : true}
          subscribeText={"Subscribe To Recipe" }
          selectedRecipe = {this.state.selectedRecipe}
          editText={"Edit Recipe"}
          deleteText={"Delete"}
          onCancel={this.modalCancelHandler} 
          onSubscribe={this.modalSubscribeToRecipeHandler}
          onDelete={this.modalDeleteRecipeHandler}
          onEdit={this.startCreateOrUpdateRecipeHandler.bind(this, 'update')}
          />)}
        {this.state.recipeToUpdate &&
        //in this case, the options are save changes or cancel (both if owner)
        (<CreateAndUpdateModal
          title="Update Recipe" 
          isUpdate
          canCancel 
          canSaveChanges 
          saveText={this.context.token && "Save Changes" }
          onCancel={this.modalCancelHandler.bind(this, 'update')} 
          onSaveChanges={this.modalConfirmHandler}
          selectedRecipe = {this.state.recipeToUpdate}
          validationError={this.state.validationError}
        >
          <InputForm 
          recipeNameEl={this.recipeNameEl} 
          dateEl={this.dateEl} 
          linkEl={this.linkEl} 
          minutesEstimateEl={this.minutesEstimateEl}
          yieldsEl={this.yieldsEl}
          recipeDescriptionEl={this.recipeDescriptionEl} 
          recipeIngredientsEl={this.recipeIngredientsEl} 
          recipeStepsEl={this.recipeStepsEl}
          recipeStepEl={this.recipeStepEl}
          ingredientAmountEl={this.ingredientAmountEl}
          ingredientUnitEl={this.ingredientUnitEl}
          ingredientNameEl={this.ingredientNameEl}
          imageHandler = {this.imageUploadHandler}
          imageEl = {this.imageEl}
          uploadedImagesEl = {this.uploadedImagesEl}
          imageUploadQueue = {this.state.imageUploadQueue}
          tagsEl = {this.tagsEl}
          newTagEl = {this.newTagEl}
          recipeToUpdate = {this.state.recipeToUpdate}
          allTags={this.state.allTags}
          />
        </CreateAndUpdateModal>)}
          <h1 className="ac caps">The Recipes Page</h1> 
        <div className="recipes-control f jcb container--5">
          <div className="left-control">
            {this.context.token && <button className="btn" onClick={this.startCreateOrUpdateRecipeHandler}>Create Recipe</button>}
            <div className="search__container f fdc">
              <label htmlFor="search">Search Recipes</label>
              <div className="form-control">
                <select className="search-by" ref={this.searchByEl} onChange={(e)=>this.setState({searchBy: e.target.value})} defaultValue="name">
                  <option value="name">Recipe Name</option>
                  <option value="user">User Email</option>
                </select>
              </div>
              <input ref={this.searchBarEl} id="search" onChange={this.handleSearch} placeholder={this.state.searchBy === 'name' ? `Try "Thai" or "Shortbread"` : `Search by user email`} />
            </div>
          </div>
          <div className="right-control">
          {this.state.allTags.length ?
            <div className="filterByTag mr2">
                <h4>Filter by Tags</h4>
                <ul className="tag-container f container--5 fw">
                 <li onClick={this.handleTagSelection} className="pr05 fw6" data-clear="clear">Clear</li> 
                  {this.state.allTags.map((tag, idx )=> {
                    console.log(tag.tag, ': ', tag.recipesWithTag, "length: ", tag.recipesWithTag && tag.recipesWithTag.length)
                    if(tag.recipesWithTag && tag.recipesWithTag.length > 0) {
                      return <li key={idx} className="pointer pr05" onClick={this.handleTagSelection}>{tag.tag}</li>
                    }
                  })}
                </ul>
            </div>
          : ''}
          </div>
        </div>
          
        {this.state.isLoading ? <Spinner /> : <RecipeList authUserId={this.context.userId} recipes={this.state.recipesInSearch} onViewDetail={this.showDetailHandler} />}
      
      </React.Fragment>
    );
  }
}

export default RecipesPage;