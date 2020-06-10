const { buildSchema } = require('graphql')

module.exports = buildSchema(`
type Subscription {
    _id: ID!
    recipe: Recipe!
    user: User!
    createdAt: String!
    updatedAt: String!
}
type User {
    _id: ID!
    email: String!
    password: String
    createdRecipes: [Recipe!]
}
type AuthData {
    userId: ID!
    token: String!
    email: String!
    tokenExpiration: Int!
}
type Recipe {
    _id: ID!
    recipeName: String!
    recipeDescription: String!
    recipeIngredients: [Ingredient!]
    recipeSteps: [Step]!
    yields: Float!
    minutesEstimate: Float!
    date: String!
    link: String!
    creator: User!
}

type Ingredient {
  _id: ID
  name: String!
  amount: Float!
  unit: String
}

type Step {
  _id: ID
  stepInstruction: String!
  stepNumber: Float!
}

input UserInput {
    email: String!
    password: String!
}
input RecipeInput {
    recipeName: String!
    recipeDescription: String!
    recipeIngredients: [IngredientInput!]
    recipeSteps: [StepInput!]
    yields: Float!
    minutesEstimate: Float!
    date: String!
    link: String!
}

input IngredientInput{
  name: String!
  amount: Float!
  unit: String
}



input StepInput {
  stepNumber: Float!
  stepInstruction: String!
}

type RootQuery {
    recipes: [Recipe!]!
    subscriptions: [Subscription!]!
    login(email: String!, password: String!): AuthData!
}
type RootMutation {
    createUser(userInput: UserInput): User
    createRecipe(recipeInput: RecipeInput): Recipe
    deleteRecipe(recipeId: ID!): Recipe
    updateRecipe(recipeId: ID!, recipeInput: RecipeInput): Recipe
    subscribeToRecipe(recipeId: ID!): Subscription!
    unsubscribeFromRecipe(subscriptionId: ID!): Recipe!
}
schema {
    query: RootQuery
    mutation: RootMutation
}
`)