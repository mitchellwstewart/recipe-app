

const createRecipeMutation = `
      mutation CreateRecipe(
        $recipeName: String!,
        $recipeDescription: String,
        $recipeIngredients: [IngredientInput!],
        $recipeSteps: [StepInput!],
        $yields: Float!,
        $minutesEstimate: Float!,
        $date: String!,
        $link: String,
        $imageLinks: [String!],
        $tags: [TagInput!]) {
        createRecipe(recipeInput: {recipeName: $recipeName, recipeDescription: $recipeDescription, recipeIngredients: $recipeIngredients, recipeSteps: $recipeSteps, yields: $yields, minutesEstimate: $minutesEstimate, date: $date, link: $link, imageLinks: $imageLinks, tags: $tags
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
          imageLinks
          tags {
            tag
            recipesWithTag {
              _id
            }
            _id
          }
        }
      }
    `
  

const updateRecipeMutation = `
    mutation UpdateRecipe(
      $recipeId: ID!,
      $recipeName: String!,
      $recipeDescription: String,
      $recipeIngredients: [IngredientInput!],
      $recipeSteps: [StepInput!],
      $yields: Float!,
      $minutesEstimate: Float!,
      $date: String!,
      $link: String,
      $imageLinks: [String!]
      $tags:  [TagInput!]
      ) {
      updateRecipe(recipeId: $recipeId, recipeInput: { recipeName: $recipeName, recipeDescription: $recipeDescription, recipeIngredients: $recipeIngredients, recipeSteps: $recipeSteps, yields: $yields minutesEstimate: $minutesEstimate, date: $date, link: $link, imageLinks: $imageLinks, tags: $tags
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
        imageLinks
        tags {
          tag
          recipesWithTag {
            _id
          }
          _id
        }
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
        imageLinks
        tags {
          tag
        }
        creator {
          _id
          email
        }
      }
      tags {
        tag
        _id
        recipesWithTag {
          _id
        }
      }
    }
  
  `

  const addTagToRecipe = `
  mutation AddTagToRecipe(
    $tag: String!
    ) {
    addTagToRecipe(tag: $tag){
      _id
      tag
      recipesWithTag {
        _id
      }
    }
  }
  `


module.exports = { createRecipeMutation, updateRecipeMutation, fetchRecipesQuery }