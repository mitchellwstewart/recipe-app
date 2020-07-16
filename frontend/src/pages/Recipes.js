
import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import ClearIcon from '@material-ui/icons/Clear';
import './Recipes.scss';
import ViewModal from '../components/Modals/ViewRecipe/ViewRecipe';
import CreateAndUpdateModal from '../components/Modals/CreateAndUpdateRecipe/CreateAndUpdateRecipe';
import Backdrop from '../components/Backdrop/Backdrop'
import AuthContext from '../context/auth-context'
import RecipeList from '../components/Recipes/RecipeList/RecipeList'
import Spinner from '../components/Spinner/Spinner'
import { createRecipeMutation, updateRecipeMutation, fetchRecipesQuery, cloudinaryUploadMutation } from '../graphqlQueries/queries'


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
    featuredImage: null,
    imageUploadQueue: [],
    imageUploadQueuePreviews: [],
    uploadedCloudinaryLinks: [],
    imageDeleteQueue: [],

    allTags: [],
    filterOpen: false,
  }

  isActive = true

  static contextType = AuthContext
  constructor(props) {
    super(props);
    this.searchBarEl = React.createRef()
    this.searchByEl = React.createRef()
  }

  componentDidMount(){
    this.fetchRecipes()
    console.log(this.context)
  }

  startCreateOrUpdateRecipeHandler = async (args) => {
    console.log('create or update modal')
    args === 'update'
      ? await this.setState(prevState => {
        return {updating: true, recipeToUpdate: prevState.selectedRecipe}
      })
    : await this.setState({creating: true})
  }

  showDetailHandler = recipeId => {
    console.log('view modal')
    this.setState(prevState => {
      const selectedRecipe = prevState.recipes.find(recipe => recipe._id === recipeId)
      return { selectedRecipe: selectedRecipe }
    })
  }

  modalCancelHandler = () => {
    document.querySelector('body').classList.remove('lock')
    this.setState({creating: false, selectedRecipe: null, updating: false, recipeToUpdate: false})
  }

  modalConfirmHandler = async ({
    recipeName, recipeDescription,
    recipeIngredients, recipeSteps,
    tags, yields, minutesEstimate, link,
    currentRecipeImages }) => {



      
      

    
    try {
      if(this.state.imageUploadQueue.length) { //REMOVE ! WHEN DONE TESTING
        console.log('this.state.imageUploadQueue: ', this.state.imageUploadQueue)
        await this.uploadToCloudinary(this.state.imageUploadQueuePreviews, this.state.uploadedCloudinaryLinks, currentRecipeImages)
      }

    //  if(this.state.imageDeleteQueue.length) {
    //    this.deleteFromCloudinary(this.state.imageDeleteQueue)
    //  }
      if(link.trim().length > 0 && recipeName.trim().length > 0) { this.setState({validationError: false}) }
      else if(
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
        imageLinks: this.state.uploadedCloudinaryLinks.length ? [...currentRecipeImages, ...this.state.uploadedCloudinaryLinks] : currentRecipeImages,
        tags: tags,
      }

      const updatedVariables = recipeId ? {...defaultVariables, recipeId} : defaultVariables
      const requestBody = {
        query: this.state.updating ? updateRecipeMutation : createRecipeMutation,
        variables: updatedVariables
      };

      console.log('requestBody: ', requestBody)
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
              return {recipes: updatedRecipes, 
                recipesInSearch: updatedRecipes, 
                creating: false, 
                updating: false,
                selectedRecipe: {
                  ...resData.data.createRecipe,
                  creator: {_id: this.context.userId}, 
                  allTags: updatedAllTags, 
                }
              }
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
              return {recipes: updatedRecipes, recipesInSearch: updatedRecipes, recipeToUpdate: null, selectedRecipe: updatedRecipe, updating: false, allTags: [...prevState.allTags, ...updatedAllTags], creating: false, updating: false}
            })
            this.searchBarEl.current.value = ""
          } 
     }
     catch(err) {
       throw err
     }
  }

  uploadToCloudinary = async (imageFilesForProcessing, uploadedCloudinaryLinks, currentRecipeImages) => {

    const imagesForCloudinary = []
    
    console.log('imageFilesForProcessing: ', imageFilesForProcessing)


    const requestBody = {
      query: cloudinaryUploadMutation,
      variables: {
        imagesForCloudinary: imageFilesForProcessing //images ready for upload to cloudinary
      }
    }

    
    const token = this.context.token;
    const cloudinaryRes = await fetch('http://localhost:3001/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    })
    if (cloudinaryRes.status !== 200 && cloudinaryRes.status !== 201) {
      throw new Error('Failed!')
    }
    const resData =  await cloudinaryRes.json()
    console.log('cloudinary resData: ', resData)

    await this.setState(prevState => {
      return {uploadedCloudinaryLinks: [...prevState.uploadedCloudinaryLinks, ...resData.data.uploadToCloudinary.map(image => {
        // !currentRecipeImages.length && !newImageLinks.length  //this is the first image, set as featured
        //   ? newImageLinks.push({link: res.data.secure_url, featured: true})
        //   : newImageLinks.push({link: res.data.secure_url, featured: false})

        return {link: image.secure_url, featured: false} //update code above to set true or false feature
      })]}
    })

    console.log('this.state.uploadedCloudinaryLinks: ', this.state.uploadedCloudinaryLinks)


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
        console.log("resData delete: ", resData)
        this.setState(prevState => {
          return {  
                  creating: false,
                  selectedRecipe: null,
                  recipes: prevState.recipes.filter(recipe => recipe._id !== resData.data.deleteRecipe._id)
                }
        })
 

        this.setState({recipesInSearch: this.state.recipes})
        this.searchBarEl.current.value = ""
      })
      .catch(err => {
        throw err
      })
  }

  imageUploadHandler = async e => {
    console.log(e.target.files)

    const imagesForUpload = e.target.files
    await this.setState(prevState => {
      return {imageUploadQueue: [...imagesForUpload, ...prevState.imageUploadQueue]}
    })


    const imagePromises = this.state.imageUploadQueue.map(async fileObject => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(fileObject)
        reader.onloadend = async () => {
          // await this.setState( prevState => {
          //   console.log('setting state: ', prevState.imageUploadQueuePreviews)
          //   return {imageUploadQueuePreviews: [...prevState.imageUploadQueuePreviews, {name: fileObject.name, base64: reader.result}]}
          // })
          //console.log('this.state.imageUploadQueuePreviews: ', this.state.imageUploadQueuePreviews)
          resolve({name: fileObject.name, base64: reader.result})
        }
      })
    })

   await Promise.all([...imagePromises]).then(async base64Images => { 
      await this.setState(prevState => {
        return {imageUploadQueuePreviews: [...prevState.imageUploadQueuePreviews, ...base64Images]}
      })

      console.log('this.state.imageUploadQueuePrevies: ', this.state.imageUploadQueuePreviews)
    });
  }

  removeImageFromQueue = e => {
    let imageToRemove = e.currentTarget.dataset.image
    this.setState(prevState => {
      let newImageQueue = prevState.imageUploadQueue.filter(image => image.name !== imageToRemove )
      return {imageUploadQueue: newImageQueue}
    })
  }

  updateImageDeleteQueue = async imageId => {
    //const imageToDelete = e.currentTarget.dataset.image
    console.log('IMAGE DELETE HANDLER: ', imageId)
    await this.setState(prevState => {
      let newImageDeleteQueue = [...prevState.imageDeleteQueue, imageId]
      console.log('new delete queue: ', newImageDeleteQueue)
      return {imageDeleteQueue: newImageDeleteQueue}
    })
    console.log('images to delete from Cloudinary: ', this.state.imageDeleteQueue)
  }

  deleteFromCloudinary = images => {
    console.log('delete images from coudinary: ', images)
  }

  handleSearch = async e => {
    let currentSearch = e.target.value
    await this.setState({recipesInSearch: this.state.recipes})
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
    if(e.currentTarget.dataset.clear) {
      this.setState({recipesInSearch: this.state.recipes})
    }
    else {
      const recipesWithTag = this.state.recipes.filter(recipe => {
        let recipeHasTag = false
        recipe.tags.forEach(tag => { if(tag.tag === e.target.innerText) recipeHasTag = true })
        if(recipeHasTag) return recipe
      })
      this.setState({recipesInSearch: recipesWithTag})
    }
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

  handleFilterIcon = e => {
    this.setState({filterOpen: !this.state.filterOpen})
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
        updateRecipeHandler = {this.modalConfirmHandler}
        validationError={this.state.validationError}
        imageUploadQueue = {this.state.imageUploadQueue}
        imageUploadQueuePreviews = {this.state.imageUploadQueuePreviews}
        imageUploadHandler = {this.imageUploadHandler}
        removeFromQueue = {this.removeImageFromQueue}
        tagsEl = {this.tagsEl}
        newTagEl = {this.newTagEl}
        allTags={this.state.allTags}
        >
          
        </CreateAndUpdateModal>)}

        {this.state.selectedRecipe && 
        //in this case, the options are delete, edit(if owner) or subscribe(if visitor)
          (<ViewModal 
          title={this.state.selectedRecipe.recipeName} 
          canCancel 
          canSubscribe = {this.context.userId !== this.state.selectedRecipe.creator._id ? true : false} 
          canEdit = {this.context.userId !== this.state.selectedRecipe.creator._id ? false : true}
          canDelete = {this.context.userId !== this.state.selectedRecipe.creator._id ? false : true}
          editText={"Edit Recipe"}
          deleteText={"Delete Recipe"}
          onCancel={this.modalCancelHandler} 
          onSubscribe={this.modalSubscribeToRecipeHandler}
          onDelete={this.modalDeleteRecipeHandler}
          onEdit={this.startCreateOrUpdateRecipeHandler.bind(this, 'update')}
          subscribeText={"Subscribe To Recipe" }
          selectedRecipe = {this.state.selectedRecipe}
          />)}


        {this.state.recipeToUpdate &&
        //in this case, the options are save changes or cancel (both if owner)
        (<CreateAndUpdateModal
          title="Update Recipe" 
          isUpdate
          canCancel 
          canSaveChanges 
          updateRecipeHandler = {this.modalConfirmHandler}
          selectedRecipe = {this.state.recipeToUpdate}
          validationError={this.state.validationError}
          imageUploadHandler = {this.imageUploadHandler}
          updateImageDeleteQueue = {this.updateImageDeleteQueue}
          removeFromQueue = {this.removeImageFromQueue}
          imageUploadQueue = {this.state.imageUploadQueue}
          imageUploadQueuePreviews = {this.state.imageUploadQueuePreviews}
          recipeToUpdate = {this.state.recipeToUpdate}
          allTags={this.state.allTags}
        >
         
        </CreateAndUpdateModal>)}
          <h1 className="ac fw5 suiz fw7 italic mt1 cw x f jcs">All Recipes</h1> 
        <div className="recipes-control f jcb container--5">
          <div className="left-control f fdc ">
            <div className="f fdc">
              <div className="search__container f fdc x">
                <div className="form-control f aic caps ls1 pt025 mb05 cw">
                  <div className="search-by_label">Search By: </div>
                  <select className="search-by_select caps fw6 ls1 cw" ref={this.searchByEl} onChange={(e)=>this.setState({searchBy: e.target.value})} defaultValue="name">
                    <option value="name">Recipe Name</option>
                    <option value="user">User Email</option>
                  </select>
                </div>
              <input ref={this.searchBarEl} id="search" className="cw" onChange={this.handleSearch} placeholder={this.state.searchBy === 'name' ? `"Thai" or "Shortbread"` : `Search by user email`} />
              </div>
              {this.state.allTags.length ?
              <div className="filterByTag mr2 mt05 cw">
                <div className="filter-title f aic pointer" onClick={this.handleFilterIcon }>
                  <h4 className="pr025 caps ls1 fw6 mt025 mb0 cw">filter by tags </h4>
                  <div className={`plus-icon f ${this.state.filterOpen ? 'active' : ""}`} ><ClearIcon /></div>
                </div>
                <ul className={`tag-container f aic mt1 container--5 fw p0 ${this.state.filterOpen ? 'active' : ''}`}>
                  {this.state.allTags.map((tag, idx )=> {
                    if(tag.recipesWithTag && tag.recipesWithTag.length > 0) {
                      return <li key={idx} className="pointer pr05 tag f jcc aic py025 px075 mr025 mb025" onClick={this.handleTagSelection}>{tag.tag}</li>
                    }
                  })}
                  <li onClick={this.handleTagSelection} className="px05 fw6 pointer f jcc aic clear-tags" data-clear="clear"><p className="caps s12 m025 ">clear</p> <ClearIcon /></li> 
                </ul>
              </div>
              : ''}
            </div>
            
          </div>
          <div className="right-control f jce aie">
          {this.context.token && <Button className="btn mr05" variant="contained" onClick={this.startCreateOrUpdateRecipeHandler}>Create Recipe</Button>}
          </div>
        </div>
          
        {this.state.isLoading ? <Spinner /> : <RecipeList authUserId={this.context.userId} recipes={this.state.recipesInSearch} onViewDetail={this.showDetailHandler} />}
      
      </React.Fragment>
    );
  }
}

export default RecipesPage;