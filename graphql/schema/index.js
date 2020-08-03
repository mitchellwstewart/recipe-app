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
    recipeDescription: String
    recipeIngredients: [Ingredient!]
    recipeSteps: [Step]!
    yields: Float!
    minutesEstimate: Float!
    date: String!
    link: String
    imageLinks: [ImageLink!]
    tags: [Tag!]
    creator: User!
}

type Ingredient {
  _id: ID
  name: String!
  amount: Float!
  unit: String
}

type ImageLink {
  _id: ID
  link: String!
  featured: Boolean!
  public_id: String!
}

type Tag {
  _id: ID!
  tag: String!
  ref: ID!
  recipesWithTag: [Recipe!]
}

type Step {
  _id: ID
  stepInstruction: String!
  stepNumber: Float!
}

type CloudinaryLink {
  secure_url: String!
  resource_type: String!
  public_id: String!
}

input UserInput {
  email: String!
  password: String!
}

input TagInput {
  tag: String!
}

input RecipeInput {
  recipeName: String!
  recipeDescription: String
  recipeIngredients: [IngredientInput!]
  recipeSteps: [StepInput!]
  yields: Float
  minutesEstimate: Float
  date: String!
  link: String
  imageLinks: [ImageLinkInput!]
  tags: [TagInput!]
}

input IngredientInput{
  name: String!
  amount: Float!
  unit: String
}

input ImageLinkInput {
  link: String!
  featured: Boolean!
  public_id: String!
}

input StepInput {
  stepNumber: Float!
  stepInstruction: String!
}

input NewImageForCloudinaryInput {
  name: String!
  base64: String!
}

input ImageToDelete {
  mongoId: String!
  cloudId: String!
}

type RootQuery {
    recipes: [Recipe!]!
    subscriptions: [Subscription!]!
    tags: [Tag!]
    checkForUser: AuthData
    login(email: String!, password: String!): AuthData!
    logout: String!
}
type RootMutation {
    createUser(userInput: UserInput): User
    addTagToRecipe(tagInput: TagInput): Tag
    createRecipe(recipeInput: RecipeInput): Recipe
    deleteRecipe(recipeId: ID!): Recipe
    updateRecipe(recipeId: ID!, recipeInput: RecipeInput): Recipe
    uploadToCloudinary(imagesForCloudinary: [NewImageForCloudinaryInput]):[CloudinaryLink!]
    deleteFromCloudinary(imageIdsToDelete: [ImageToDelete!]): [String!]
    subscribeToRecipe(recipeId: ID!): Subscription!
    unsubscribeFromRecipe(subscriptionId: ID!): Recipe!
}
schema {
    query: RootQuery
    mutation: RootMutation
}
`)