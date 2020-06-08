import React, { Component } from 'react';
import './Recipes.scss';
import ViewModal from '../components/Modals/ViewRecipe/ViewRecipe';
import CreateAndUpdateModal from '../components/Modals/CreateAndUpdateRecipe/CreateAndUpdateRecipe';
import InputForm from '../components/Modals/InputForm/InputForm';
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
    validationError: false,
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
    this.recipeStepEl = React.createRef();
    this.minutesEstimateEl = React.createRef();
    this.yieldsEl = React.createRef();
    this.dateEl = React.createRef();
    this.linkEl = React.createRef();
    this.ingredientAmountEl = React.createRef();
    this.ingredientUnitEl = React.createRef();
    this.ingredientNameEl = React.createRef();
  }

  componentDidMount(){
    this.fetchRecipes()
  }

  startCreateOrUpdateRecipeHandler = (args) => {
    args === 'update'
      ? this.setState(prevState => {
        return {updating: true, recipeToUpdate: prevState.selectedRecipe, selectedRecipe: null}
      })
    : this.setState({creating: true})
  }

  modalCancelHandler = (args) => {
    this.setState({creating: false, selectedRecipe: null, updating: false, recipeToUpdate: false})
  }

  modalConfirmHandler = () => {
    
    const recipeName = this.recipeNameEl.current.value
    const recipeDescription = this.recipeDescriptionEl.current.value
    const recipeIngredients = Array.from(this.recipeIngredientsEl.current.children).map(ingredientNode => {
      const ingredientName = ingredientNode.querySelector('[data-name]').dataset.name
      const ingredientAmount = +ingredientNode.querySelector('[data-amount]').dataset.amount
      const ingredientUnit = ingredientNode.querySelector('[data-unit]').dataset.unit
        return {name: ingredientName, amount: ingredientAmount, unit: ingredientUnit}
    })
    const recipeSteps = Array.from(this.recipeStepsEl.current.children).map((stepNode, idx) => {
      const stepNumber = +(idx+1)
      const stepInstruction = stepNode.querySelector('span.step-content').innerText
        return {stepNumber: stepNumber, stepInstruction: stepInstruction}
    })
    const yields = +this.yieldsEl.current.value
    const minutesEstimate = +this.minutesEstimateEl.current.value
    const link = this.linkEl.current.value
    if(
      recipeName.trim().length === 0 ||
      recipeDescription.trim().length === 0 ||
      recipeIngredients.length === 0 ||
      recipeSteps.length === 0 ||
      yields <= 0 || 
      minutesEstimate <= 0 ||
      link.trim().length === 0 
    ){
      this.setState({validationError: true})
      setTimeout(()=> {
        this.setState({validationError: false})
      }, 3000)
      return;
    }
    this.setState({creating: false})
      const requestBody = {
        query: `
          mutation CreateRecipe(
            $recipeName: String!,
            $recipeDescription: String!,
            $recipeIngredients: [IngredientInput!],
            $recipeSteps: [StepInput!],
            $yields: Float!,
            $minutesEstimate: Float!,
            $date: String!,
            $link: String!) {
            createRecipe(recipeInput: {recipeName: $recipeName, recipeDescription: $recipeDescription, recipeIngredients: $recipeIngredients, recipeSteps: $recipeSteps, yields: $yields, minutesEstimate: $minutesEstimate, date: $date, link: $link 
            }){
              _id
              recipeName
              recipeDescription
              recipeIngredients {
                _id
                name
                unit
                amount
              }
              recipeSteps {
                stepNumber
                stepInstruction
              }
              yields
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
          yields: yields,
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
          console.log('resData:', resData)
          this.setState(prevState => {
            const updatedRecipes = [...prevState.recipes]
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
    
    const recipeName = this.recipeNameEl.current.value
    const recipeDescription = this.recipeDescriptionEl.current.value
    const recipeIngredients = Array.from(this.recipeIngredientsEl.current.children).map(ingredientNode => {
      const ingredientName = ingredientNode.querySelector('[data-name]').dataset.name
      const ingredientAmount = +ingredientNode.querySelector('[data-amount]').dataset.amount
      const ingredientUnit = ingredientNode.querySelector('[data-unit]').dataset.unit
        return {name: ingredientName, amount: ingredientAmount, unit: ingredientUnit}
    })
    const recipeSteps = Array.from(this.recipeStepsEl.current.children).map((stepNode, idx) => {
      const stepNumber = +(idx+1)
      const stepInstruction = stepNode.querySelector('span.step-content').innerText
        return {stepNumber: stepNumber, stepInstruction: stepInstruction}
    })
    const yields = +this.yieldsEl.current.value
    const minutesEstimate = +this.minutesEstimateEl.current.value
    const link = this.linkEl.current.value
     if(
       recipeName.trim().length === 0 ||
       recipeDescription.trim().length === 0 ||
       recipeIngredients.length === 0 ||
       recipeSteps.length === 0 ||
       minutesEstimate <= 0 ||
       yields <= 0 ||
       link.trim().length === 0 
     ){
       console.log('validationerror')
      this.setState({validationError: true})
      setTimeout(()=> {
        this.setState({validationError: false})
      }, 3000)
       return;
     }
     this.setState({updating: false})
       const requestBody = {
         query: `
           mutation UpdateRecipe(
             $recipeId: ID!,
             $recipeName: String!,
             $recipeDescription: String!,
             $recipeIngredients: [IngredientInput!],
             $recipeSteps: [StepInput!],
             $yields: Float!,
             $minutesEstimate: Float!,
             $date: String!,
             $link: String!) {
             updateRecipe(recipeId: $recipeId, recipeInput: { recipeName: $recipeName, recipeDescription: $recipeDescription, recipeIngredients: $recipeIngredients, recipeSteps: $recipeSteps, yields: $yields minutesEstimate: $minutesEstimate, date: $date, link: $link 
             }){
               _id
               recipeName
               recipeDescription
               recipeIngredients {
                _id
                name
                unit
                amount
              }
              recipeSteps {
                stepNumber
                stepInstruction
              }
               yields
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
           yields: yields,
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
           const updatedRecipe = {...resData.data.updateRecipe, creator: {_id: prevState.recipeToUpdate.creator._id}}
           const updatedRecipes = [...prevState.recipes.filter(recipe => recipe._id !== resData.data.updateRecipe._id), updatedRecipe]
           return {recipes: updatedRecipes, recipeToUpdate: null, updating: false}
         })
       }).catch(err => {
         throw err
       })
  }

  showDetailHandler = recipeId => {
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
    this.setState({isLoading: true})
    const requestBody = {
      query: `
        query {
          recipes{
            _id
            recipeName
            recipeDescription
            recipeIngredients {
              name
              amount
              unit
            }
            recipeSteps {
              stepNumber
              stepInstruction
            }
            yields
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
          onDrop = {this.imageUploadHandler}
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
          onSaveChanges={this.modalUpdateRecipeHandler}
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
          onDrop = {this.imageUploadHandler}
          recipeToUpdate = {this.state.recipeToUpdate}
          />
        </CreateAndUpdateModal>)}
        <div className="recipes-control">
          <h1 className="ac caps">The Recipes Page</h1> 
          {this.context.token && <button className="btn" onClick={this.startCreateOrUpdateRecipeHandler}>Create Recipe</button>}
        </div>
        {this.state.isLoading ? <Spinner /> : <RecipeList authUserId={this.context.userId} recipes={this.state.recipes} onViewDetail={this.showDetailHandler} />}
      
      </React.Fragment>
    );
  }
}

export default RecipesPage;