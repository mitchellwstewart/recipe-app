
const loginQuery = `
query Login($email: String!, $password: String! ) {
  login(email: $email, password: $password) {
    userId
    email
    token
    tokenExpiration
  }
}
`

const createUserMutation = `
mutation CreateUser($email: String!, $password: String!){
  createUser(userInput: {email: $email, password: $password}){
    _id
    email
  }
}
`

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
        $imageLinks: [ImageLinkInput!],
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
          imageLinks {
            _id
            link
            featured
            public_id
          }
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
      $imageLinks: [ImageLinkInput!]
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
        imageLinks {
          _id
          link
          featured
          public_id
        }
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

  const checkForUserQuery = `
  query {
    checkForUser {
      userId
      email
      token
      tokenExpiration
    }
  }
  `

  const logoutQuery = `
  query {
    logout 
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
        imageLinks {
          _id
          link
          featured
          public_id
        }
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
  const cloudinaryUploadMutation = `
  mutation UploadToCloudinary($imagesForCloudinary: [NewImageForCloudinaryInput]) {
    uploadToCloudinary(imagesForCloudinary: $imagesForCloudinary )
      {
        secure_url
        resource_type
        public_id
      }  
    }
  `

  const cloudinaryDeleteMutation = `
  mutation DeleteFromCloudinary($imageIdsToDelete: [ImageToDelete!]) {
    deleteFromCloudinary(imageIdsToDelete: $imageIdsToDelete) 
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


module.exports = { loginQuery, logoutQuery, checkForUserQuery, createUserMutation, createRecipeMutation, updateRecipeMutation, fetchRecipesQuery, cloudinaryUploadMutation, cloudinaryDeleteMutation }