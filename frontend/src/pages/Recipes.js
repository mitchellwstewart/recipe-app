
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
import {  fetchRecipesQuery } from '../graphqlQueries/queries'


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

  showDetailHandler = async recipeId => {
    await this.setState(prevState => {
      const selectedRecipe = prevState.recipes.find(recipe => recipe._id === recipeId)
      return { selectedRecipe: selectedRecipe }
    })
  }

  handleRecipesStateUpdate = (recipe, trigger) => {
    console.log('recipe: ', recipe)
    this.searchBarEl.current.value = ""
    if(trigger === "delete") {
      const deletedRecipe = this.state.recipes.find(existingRecipe => {
        console.log('exisitingRecipe: ', existingRecipe)
       return existingRecipe._id === recipe
      })
      this.setState(prevState => { 
        const updatedRecipes = [...prevState.recipes.filter(existingRecipe => existingRecipe._id !== deletedRecipe._id)]
        const previousAllTags = {}
        prevState.allTags.forEach(tagObj => previousAllTags[tagObj.tag] = tagObj) 
        return {
          recipes: updatedRecipes,
          recipesInSearch: updatedRecipes, 
          recipeToUpdate: null, 
          creating: false, 
          updating: false, 
          selectedRecipe: null 
        }
      })
    }
    else {
      this.setState(prevState => { 
         const updatedRecipes = trigger === 'update' 
          ? [...prevState.recipes.filter(exisitingRecipe => exisitingRecipe._id !== recipe._id), recipe]
          : [recipe, ...prevState.recipes]
         const previousAllTags = {}
         prevState.allTags.forEach(tagObj => previousAllTags[tagObj.tag] = tagObj) 
         const updatedAllTags = recipe.tags.filter(newTag => !previousAllTags[newTag.tag] && newTag );
         return {
           recipes: updatedRecipes,
           recipesInSearch: updatedRecipes, 
           recipeToUpdate: null, 
           creating: false, 
           updating: false, 
           selectedRecipe: trigger === "update" ? recipe : { ...recipe, creator: {_id: this.context.userId}, }, 
           allTags: trigger === "update" ? [...prevState.allTags, ...updatedAllTags] : updatedAllTags, 
         }
       })

    }
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
    console.log('this.context.token: ', this.context.token)
    const token = this.context.token;
      fetch('http://localhost:3001/graphql', {
        method: 'POST',
        credentials: 'include',
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

  modalCancelHandler = () => {
    document.querySelector('body').classList.remove('lock')
    this.setState({creating: false, selectedRecipe: null, updating: false, recipeToUpdate: false})
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
        onCancel={this.modalCancelHandler} 
        isCreate
        validationError={this.state.validationError}
        tagsEl = {this.tagsEl}
        newTagEl = {this.newTagEl}
        allTags={this.state.allTags}
        handleRecipesStateUpdate={this.handleRecipesStateUpdate}
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
          handleRecipesStateUpdate={this.handleRecipesStateUpdate}
          />)}


        {this.state.recipeToUpdate &&
        //in this case, the options are save changes or cancel (both if owner)
        (<CreateAndUpdateModal
          title="Update Recipe" 
          isUpdate
          canCancel 
          onCancel={this.modalCancelHandler} 
          canSaveChanges 
          selectedRecipe = {this.state.recipeToUpdate}
          validationError={this.state.validationError}
          recipeToUpdate = {this.state.recipeToUpdate}
          allTags={this.state.allTags}
          handleRecipesStateUpdate={this.handleRecipesStateUpdate}
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