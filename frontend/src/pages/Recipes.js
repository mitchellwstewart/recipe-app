import React, { Component } from 'react';
import './Recipes.scss';
import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop'
import AuthContext from '../context/auth-context'
import RecipeList from '../components/Recipes/RecipeList/RecipeList'
import Spinner from '../components/Spinner/Spinner'

class RecipesPage extends Component {
  state = {
    creating: false,
    recipes: [],
    isLoading: false
  }

  static contextType = AuthContext
  constructor(props) {
    super(props);
    this.recipeNameEl = React.createRef();
    this.recipeDescriptionEl = React.createRef();
    this.recipeIngredientsEl = React.createRef();
    this.recipeStepsEl = React.createRef();
    this.minutesEstimateEl = React.createRef();
    this.dateEl = React.createRef();
    this.linkEl = React.createRef();
  }

  componentDidMount(){
    this.fetchRecipes()
  }


  startCreateEventHandler = () => {
    this.setState({creating: true})
  }

  modalCancelHandler = () => {
    this.setState({creating: false, selectedRecipe: null})
  }

  subscribeToRecipeHandler = () => {

  }

  modalConfirmHandler = () => {
    this.setState({creating: false})
    const recipeName = this.recipeNameEl.current.value
    const recipeDescription = this.recipeDescriptionEl.current.value
    const recipeIngredients = this.recipeIngredientsEl.current.value
    const recipeSteps = this.recipeStepsEl.current.value
    const minutesEstimate = +this.minutesEstimateEl.current.value
    const date = this.dateEl.current.value
    const link = this.linkEl.current.value
    if(
      recipeName.trim().length === 0 ||
      recipeDescription.trim().length === 0 ||
      recipeIngredients.trim().length === 0 ||
      recipeSteps.trim().length === 0 ||
      minutesEstimate <= 0 ||
      date.trim().length === 0 ||
      link.trim().length === 0 
    ){
      return;
    }
      const requestBody = {
        query: `
          mutation {
            createRecipe(recipeInput: {recipeName: "${recipeName}",recipeDescription: "${recipeDescription}",recipeIngredients: "${recipeIngredients}",recipeSteps: "${recipeSteps}",minutesEstimate: ${minutesEstimate},date: "${date}",link: "${link}" 
            }){
              _id
              recipeName
              recipeDescription
              recipeIngredients
              recipeSteps
              minutesEstimate
              date
              link
            }
          }
        `};
    
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
          this.setState(prevState => {
            const updatedRecipes = [...prevState.recipes]
            updatedRecipes.push({
              _id: resData.data.createRecipe._id,
              recipeName: resData.data.createRecipe.recipeName,
              recipeDescription: resData.data.createRecipe.recipeDescription,
              recipeIngredients: resData.data.createRecipe.recipeIngredients,
              recipeSteps: resData.data.createRecipe.recipeSteps,
              minutesEstimate: resData.data.createRecipe.minutesEstimate,
              date: resData.data.createRecipe.date,
              link: resData.data.createRecipe.link,
              creator: {
                _id: this.context.userId,
              }
            })
            return {recipes: updatedRecipes}
          })
        }).catch(err => {
          throw err
        })
    }

    fetchRecipes() {
      this.setState({isLoading: true})
      const requestBody = {
        query: `
          query {
            recipes{
              _id
              recipeName
              recipeDescription
              recipeIngredients
              recipeSteps
              minutesEstimate
              date
              link
              creator {
                _id
                email
              }
            }
          }
        `
      }
    
        fetch('http://localhost:3001/graphql', {
          method: 'POST',
          body: JSON.stringify(requestBody),
          headers: {
            'Content-Type': 'application/json',
          }
        }).then(res => {
          if(res.status !== 200 && res.status !== 201) {
            throw new Error('Failed!')
          }
          return res.json()
        }).then(resData => {
          const recipes = resData.data.recipes
          this.setState({recipes: recipes, isLoading: false})
        })
        
        .catch(err => {
          this.setState({isLoading: false})
          throw err
        })
    }

    deleteRecipeHandler = () => {
      console.log('recipe delete request by creator')
    }
    showDetailHandler = recipeId => {
      this.setState(prevState => {
        const selectedRecipe = prevState.recipes.find(recipe => recipe._id === recipeId)
        return { selectedRecipe: selectedRecipe }
      })
    }
    render() {
        return(
          <React.Fragment>
            {this.state.creating || this.state.selectedRecipe && <Backdrop />}
            {this.state.creating && 
            (
            <Modal title="Add New" 
            canCancel 
            canConfirm 
            confirmText="Confirm"
            onCancel={this.modalCancelHandler} 
            onConfirm={this.modalConfirmHandler}
            >
              <form>
                <div className="form-control">
                  <label htmlFor="recipeName">Recipe Name</label>
                  <input ref={this.recipeNameEl} type="text" id="recipeName" />
                </div>
                <div className="form-control">
                  <label htmlFor="recipeDescription">Recipe Description</label>
                  <textarea ref={this.recipeDescriptionEl} type="text" id="recipeDescription" rows="4" />
                </div>
                <div className="form-control">
                  <label htmlFor="recipeIngredients">Recipe Ingredients</label>
                  <textarea ref={this.recipeIngredientsEl} type="text" id="recipeIngredients"  rows="4"/>
                </div>
                <div className="form-control">
                  <label htmlFor="recipeSteps">Recipe Steps</label>
                  <textarea ref={this.recipeStepsEl} type="text" id="recipeSteps" rows="4"/>
                </div>
                <div className="form-control">
                  <label htmlFor="minutesEstimate">Estimated Minutes</label>
                  <input ref={this.minutesEstimateEl} type="number" id="minutesEstimate" />
                </div>
                <div className="form-control">
                  <label htmlFor="date">date</label>
                  <input className="" ref={this.dateEl} type="datetime-local" id="date"/>
                </div>
                <div className="form-control">
                  <label htmlFor="recipeLink">Recipe Link</label>
                  <input ref={this.linkEl} type="url" id="recipeLink" />
                </div>
              </form>
            </Modal>) }
            {this.state.selectedRecipe && 
              (<Modal title={this.state.selectedRecipe.recipeName} 
              canCancel 
              canConfirm 
              canDelete = {!this.context.userId && false}
              confirmText="Subscripe To Recipe"
              onCancel={this.modalCancelHandler} 
              onConfirm={this.subscribeToRecipeHandler}
              onDelete={this.deleteRecipeHandler}>
                <h1>{this.state.selectedRecipe.recipeName}</h1>
                <h3>Estimated Time: {this.state.selectedRecipe.minutesEstimate} mins</h3>
                <h3>Date Added: {new Date(this.state.selectedRecipe.date).toLocaleDateString()}</h3>
                <p>{this.state.selectedRecipe.recipeDescription}</p>
            </Modal>)
            }
            <div className="recipes-control">
              <h1>The Recipes Page</h1>
              {this.context.token && <button className="btn" onClick={this.startCreateEventHandler}>Create Recipe</button>}
            </div>
            {this.state.isLoading ? <Spinner /> : <RecipeList authUserId={this.context.userId} recipes={this.state.recipes} onViewDetail={this.showDetailHandler} />}
         
          </React.Fragment>
          
            
        );
    }

}

export default RecipesPage;