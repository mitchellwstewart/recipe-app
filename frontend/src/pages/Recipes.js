import React, { Component } from 'react';
import './Recipes.scss';
import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop'
import AuthContext from '../context/auth-context'

class RecipesPage extends Component {
  state = {
    creating: false,
    recipes: []

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
    this.fetchEvents()
  }


  startCreateEventHandler = () => {
    this.setState({creating: true})
  }

  modalCancelHandler = () => {
    this.setState({creating: false})
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
      console.log('not all valid inputs')
      return;
    }

    const recipe = {recipeName, recipeDescription, recipeIngredients, recipeSteps, minutesEstimate, date, link}
    console.log('recipe: ', recipe)
    
      const requestBody = {
        query: `
          mutation {
            createRecipe(recipeInput: {
              recipeName: "${recipeName}",
              recipeDescription: "${recipeDescription}",
              recipeIngredients: "${recipeIngredients}",
              recipeSteps: "${recipeSteps}",
              minutesEstimate: ${minutesEstimate},
              date: "${date}",
              link: "${link}" 
            }){
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
      };
    
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
          this.fetchEvents();
        })
        
        .catch(err => {
          throw err
        })
    }

    fetchEvents() {
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
          this.setState({recipes: recipes})
        })
        
        .catch(err => {
          throw err
        })

    }
    render() {
      const recipeList = this.state.recipes.map(recipe => {
        return <li key={recipe._id} className="recipes__list-item">{recipe.recipeName}</li>
      })
        return(
          <React.Fragment>
            {this.state.creating && <Backdrop />}
            {this.state.creating && 
            (<Modal title="Add New" canCancel canConfirm onCancel={this.modalCancelHandler} onConfirm={this.modalConfirmHandler}>
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
              
            <div className="recipes-control">
              <h1>The Recipes Page</h1>
              {this.context.token && <button className="btn" onClick={this.startCreateEventHandler}>Create Recipe</button>}
            </div>
            
            <ul className="recipes__list">
            {recipeList}
              
            </ul>
          </React.Fragment>
          
            
        );
    }

}

export default RecipesPage;