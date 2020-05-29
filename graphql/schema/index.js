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
type Recipe {
    _id: ID!
    recipeName: String!
    recipeDescription: String!
    recipeIngredients: String!
    recipeSteps: String!
    minutesEstimate: Float!
    date: String!
    link: String!
    creator: User!
}

input UserInput {
    email: String!
    password: String!
}
input RecipeInput {
    recipeName: String!
    recipeDescription: String!
    recipeIngredients: String!
    recipeSteps: String!
    minutesEstimate: Float!
    date: String!
    link: String!
}
type RootQuery {
    recipes: [Recipe!]!
    subscriptions: [Subscription!]!
}
type RootMutation {
    createUser(userInput: UserInput): User
    createRecipe(recipeInput: RecipeInput): Recipe
    subscribeToRecipe(recipeId: ID!): Subscription!
    unsubscribeFromRecipe(subscriptionId: ID!): Recipe!
}
schema {
    query: RootQuery
    mutation: RootMutation
}
`)