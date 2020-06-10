

const createRecipeMutation = `
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
    `
  

const updateRecipeMutation = `
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
  `


const fetchRecipesQuery = `
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


module.exports = { createRecipeMutation, updateRecipeMutation, fetchRecipesQuery }