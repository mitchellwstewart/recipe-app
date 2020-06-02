const Recipe = require ('../../models/recipe')
const User = require ('../../models/user')
const { dateToString } = require('../../helpers/date')
const DataLoader = require('dataloader')

const recipeLoader = new DataLoader(recipeIds => {
  return recipes(recipeIds)
})

const userLoader = new DataLoader(userIds => {
  console.log('userIds: ', userIds)
  return User.find({_id: {$in: userIds}})
})

const transformRecipe = recipe => {
    return {
        ...recipe._doc,
        _id: recipe._doc._id.toString() ,
        date: dateToString(recipe._doc.date),
        creator: user.bind(this, recipe._doc.creator)    
    };
};

const transformSubscription = subscription => {
    return {
        ...subscription._doc,
        _id: subscription.id,
        user: user.bind(this, subscription._doc.user),
        recipe: singleRecipe.bind(this, subscription._doc.recipe),
        createdAt: dateToString(subscription._doc.createdAt),
        updatedAt: dateToString(subscription._doc.updatedAt)
    }
}
const user = async userId => {
    try {
        const user = await userLoader.load(userId.toString())
        return {...user._doc, _id: user.id, createdRecipes: () => recipeLoader.loadMany(user._doc.createdRecipes )}
    }
    catch(err) {throw err}
}

const singleRecipe = async recipeId => {
    try {
        const recipe = await recipeLoader.load(recipeId.toString())
        return recipe
    }
    catch (err) {
      console.log('ERROR: ', err)
        throw err 
    }
}

const recipes = async recipeIds => {
    try {
        const recipes = await Recipe.find({_id: {$in: recipeIds}})
        recipes.sort((a,b) => recipeIds.indexOf(a._id.toString()) - recipeIds.indexOf(b._id.toString()))
        console.log('recipes: ', recipes)
        console.log('recipeIds: ', recipeIds)
        return recipes.map(recipe => transformRecipe(recipe))
    }
    catch (err) {throw err}
}

// exports.user = user;
// exports.singleRecipe = singleRecipe;
// exports.recipes = recipes;
exports.transformRecipe = transformRecipe
exports.transformSubscription = transformSubscription