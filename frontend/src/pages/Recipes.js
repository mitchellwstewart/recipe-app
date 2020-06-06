import React, { Component } from 'react';
import './Recipes.scss';
import Modal from '../components/Modal/Modal';
import InputForm from '../components/Modal/InputForm/InputForm';
import Backdrop from '../components/Backdrop/Backdrop'
import AuthContext from '../context/auth-context'
import RecipeList from '../components/Recipes/RecipeList/RecipeList'
import Spinner from '../components/Spinner/Spinner'

class RecipesPage extends Component {
  state = {
    creating: false,
    updating: false,
    recipes: [],
    isLoading: false,
    selectedRecipe: null,
    recipeToUpdate: null,
    imageFile: null
  }

  isActive = true


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
    console.log('component did mount')
  }


  startCreateOrUpdateRecipeHandler = (args) => {
    args === 'update' ? console.log('UPDATING ') : console.log('CREATING')
    if(args === 'update'){
      this.setState(prevState => {
        return {updating: true, recipeToUpdate: prevState.selectedRecipe, selectedRecipe: null}
      })
    } 
    else  this.setState({creating: true})
    console.log('startCreateOrUpdateRecipeHandler')
    
  }

  modalCancelHandler = (args) => {
    console.log('modalCancelHandler')
    this.setState({creating: false, selectedRecipe: null, updating: false, recipeToUpdate: false})
  }

  modalConfirmHandler = () => {
    console.log('modalConfirmHandler')
    console.log('date: ', this.dateEl)
    this.setState({creating: false})
    const recipeName = this.recipeNameEl.current.value
    const recipeDescription = this.recipeDescriptionEl.current.value
    const recipeIngredients = this.recipeIngredientsEl.current.value
    const recipeSteps = this.recipeStepsEl.current.value
    const minutesEstimate = +this.minutesEstimateEl.current.value
    const link = this.linkEl.current.value
    if(
      recipeName.trim().length === 0 ||
      recipeDescription.trim().length === 0 ||
      recipeIngredients.trim().length === 0 ||
      recipeSteps.trim().length === 0 ||
      minutesEstimate <= 0 ||
      link.trim().length === 0 
    ){
      return;
    }
      const requestBody = {
        query: `
          mutation CreateRecipe(
            $recipeName: String!,
            $recipeDescription: String!,
            $recipeIngredients: String!,
            $recipeSteps: String!,
            $minutesEstimate: Float!,
            $date: String!,
            $link: String!) {
            createRecipe(recipeInput: {recipeName: $recipeName, recipeDescription: $recipeDescription, recipeIngredients: $recipeIngredients, recipeSteps: $recipeSteps, minutesEstimate: $minutesEstimate, date: $date, link: $link 
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
        `,
        variables: {
          recipeName: recipeName,
          recipeDescription: recipeDescription,
          recipeIngredients: recipeIngredients,
          recipeSteps: recipeSteps,
          minutesEstimate: minutesEstimate,
          date: new Date().toISOString(),
          link: link
        }
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

  modalSubscribeToRecipeHandler = () => {
    console.log('subscribeToRecipeHandler')
    if(!this.context.token) {
      this.setState({selectedRecipe: null})
      return;
    }
    // this.setState({isLoading: true})
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
        console.log('resData: ', resData)
        this.setState({selectedRecipe: null})
      })
      
      .catch(err => {
        throw err
    })
  }

  modalDeleteRecipeHandler = () => {
    console.log('deleteRecipeHandler')
    console.log('recipe delete request by creator')
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
        this.setState({creating: false, selectedRecipe: null})
        
        this.setState(prevState => {
          return {recipes: prevState.recipes.filter(recipe => recipe._id !== resData.data.deleteRecipe._id)}
        })
      })
      .catch(err => {
        throw err
      })
  }

  modalUpdateRecipeHandler = () => {
    console.log('updateRecipeHandler')
    console.log('recipe update request by creator')    
    this.setState({updating: false})
    const recipeName = this.recipeNameEl.current.value
    const recipeDescription = this.recipeDescriptionEl.current.value
    const recipeIngredients = this.recipeIngredientsEl.current.value
    const recipeSteps = this.recipeStepsEl.current.value
    const minutesEstimate = +this.minutesEstimateEl.current.value
    const link = this.linkEl.current.value
     if(
       recipeName.trim().length === 0 ||
       recipeDescription.trim().length === 0 ||
       recipeIngredients.trim().length === 0 ||
       recipeSteps.trim().length === 0 ||
       minutesEstimate <= 0 ||
       link.trim().length === 0 
     ){
       return;
     }
       const requestBody = {
         query: `
           mutation UpdateRecipe(
             $recipeId: ID!,
             $recipeName: String!,
             $recipeDescription: String!,
             $recipeIngredients: String!,
             $recipeSteps: String!,
             $minutesEstimate: Float!,
             $date: String!,
             $link: String!) {
             updateRecipe(recipeId: $recipeId, recipeInput: { recipeName: $recipeName, recipeDescription: $recipeDescription, recipeIngredients: $recipeIngredients, recipeSteps: $recipeSteps, minutesEstimate: $minutesEstimate, date: $date, link: $link 
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
         `,
         variables: {
           recipeId: this.state.recipeToUpdate._id,
           recipeName: recipeName,
           recipeDescription: recipeDescription,
           recipeIngredients: recipeIngredients,
           recipeSteps: recipeSteps,
           minutesEstimate: minutesEstimate,
           date: new Date().toISOString(),
           link: link
         }
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
         console.log('resData.data: ', resData.data)
         this.setState(prevState => {
           console.log("PREV SATE: ", prevState)
           const updatedRecipe = {...resData.data.updateRecipe, creator: {_id: prevState.recipeToUpdate.creator._id}}
           const updatedRecipes = [...prevState.recipes.filter(recipe => recipe._id !== resData.data.updateRecipe._id), updatedRecipe]
           return {recipes: updatedRecipes, recipeToUpdate: null, updating: false}
         })
       }).catch(err => {
         throw err
       })






  }

  showDetailHandler = recipeId => {
    console.log('showDetailHandler')
    this.setState(prevState => {
      const selectedRecipe = prevState.recipes.find(recipe => recipe._id === recipeId)
      return { selectedRecipe: selectedRecipe }
    })
  }

  imageUploadHandler = async files => {
    this.setState({imageFile: files[0]})
    console.log(this.state.imageFile)
  }

  fetchRecipes() {
    console.log('fetchRecipes')
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
        if(this.isActive) {
          this.setState({recipes: recipes, isLoading: false})
          console.log('state: ', this.state)
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
        <Modal title="Add New" 
        //in this case, the options is confrim only (always owner)
        canCancel 
        canConfirm 
        confirmText="Confirm"
        onCancel={this.modalCancelHandler} 
        onConfirm={this.modalConfirmHandler}
        >
          <InputForm 
          recipeNameEl={this.recipeNameEl} 
          dateEl={this.dateEl} 
          linkEl={this.linkEl} 
          minutesEstimateEl={this.minutesEstimateEl}
          recipeDescriptionEl={this.recipeDescriptionEl} 
          recipeIngredientsEl={this.recipeIngredientsEl} 
          recipeStepsEl={this.recipeStepsEl}
          onDrop = {this.imageUploadHandler}
          />
        </Modal>)}
        {this.state.selectedRecipe && 
        //in this case, the options are delete, edit(if owner) or subscribe(if visitor)
          (<Modal 
          title={this.state.selectedRecipe.recipeName} 
          canCancel 
          canSubscribe = {this.context.userId !== this.state.selectedRecipe.creator._id ? true : false} 
          canEdit = {this.context.userId !== this.state.selectedRecipe.creator._id ? false : true}
          canDelete = {this.context.userId !== this.state.selectedRecipe.creator._id ? false : true}
          subscribeText={"Subscribe To Recipe" }
          editText={"Edit Recipe"}
          deleteText={"Delete"}
          onCancel={this.modalCancelHandler} 
          onSubscribe={this.modalSubscribeToRecipeHandler}
          onDelete={this.modalDeleteRecipeHandler}
          onEdit={this.startCreateOrUpdateRecipeHandler.bind(this, 'update')}
          >
            <h1>{this.state.selectedRecipe.recipeName}</h1>
            <h3>Estimated Time: {this.state.selectedRecipe.minutesEstimate} mins</h3>
            <h3>Date Added: {new Date(this.state.selectedRecipe.date).toLocaleDateString()}</h3>
            <p>{this.state.selectedRecipe.recipeDescription}</p>
        </Modal>)}
        {this.state.recipeToUpdate &&
        //in this case, the options are save changes or cancel (both if owner)
        (<Modal
          title="Update Recipe" 
          canCancel 
          canSaveChanges 
          saveText={this.context.token && "Save Changes" }
          onCancel={this.modalCancelHandler.bind(this, 'update')} 
          onSaveChanges={this.modalUpdateRecipeHandler}
        >
          <InputForm 
          recipeNameEl={this.recipeNameEl} 
          recipeNameValue={this.state.recipeToUpdate.recipeName} 
          dateEl={this.dateEl} 
          dateValue={this.state.recipeToUpdate.date} 
          linkEl={this.linkEl} 
          linkValue={this.state.recipeToUpdate.link} minutesEstimateEl={this.minutesEstimateEl} minutesEstimateValue={this.state.recipeToUpdate.minutesEstimate} recipeDescriptionEl={this.recipeDescriptionEl} recipeDescriptionValue={this.state.recipeToUpdate.recipeDescription} recipeIngredientsEl={this.recipeIngredientsEl} recipeIngredientsValue={this.state.recipeToUpdate.recipeIngredients} recipeStepsEl={this.recipeStepsEl} recipeStepsValue={this.state.recipeToUpdate.recipeSteps} 
          onDrop = {this.imageUploadHandler}
          />
        </Modal>)}
        <div className="recipes-control">
          <h1 className="ac">The Recipes Page</h1> 
          {this.context.token && <button className="btn" onClick={this.startCreateOrUpdateRecipeHandler}>Create Recipe</button>}
        </div>
        {this.state.isLoading ? <Spinner /> : <RecipeList authUserId={this.context.userId} recipes={this.state.recipes} onViewDetail={this.showDetailHandler} />}
      
      </React.Fragment>
    );
  }
}

export default RecipesPage;