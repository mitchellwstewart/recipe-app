const Recipe = require ('../../models/recipe')
const User = require ('../../models/user')
const { dateToString } = require('../../helpers/date')
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
        const user = await User.findById(userId)
        return {...user._doc, _id: user.id, createdRecipes: recipes.bind(this, user._doc.createdRecipes )}
    }
    catch(err) {throw err}
}

const singleRecipe = async recipeId => {
    try {
        const recipe = await Recipe.findById(recipeId)
        return transformRecipe(recipe)
    }
    catch (err) {
        throw err 
    }
}

const recipes = async recipeIds => {
    try {
        const recipes = await Recipe.find({_id: {$in: recipeIds}})
        return recipes.map(recipe => transformRecipe(recipe))
    }
    catch (err) {throw err}
}

// exports.user = user;
// exports.singleRecipe = singleRecipe;
// exports.recipes = recipes;
exports.transformRecipe = transformRecipe
exports.transformSubscription = transformSubscription