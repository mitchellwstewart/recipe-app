const Recipe = require ('../../models/recipe')
const User = require ('../../models/user')
const { dateToString } = require('../../helpers/date')
const DataLoader = require('dataloader')
const Tag = require('../../models/tag')

const recipeLoader = new DataLoader(recipeIds => {
  return recipes(recipeIds)
})

const userLoader = new DataLoader(userIds => {
  return User.find({_id: {$in: userIds}})
})

const transformRecipe = recipe => {
    return {
        ...recipe._doc,
        _id: recipe._doc._id.toString() ,
        date: dateToString(recipe._doc.date),
        creator: user.bind(this, recipe._doc.creator),
        tags: tags.bind(this, recipe._doc.tags)
    };
};

const transformTag = tag => {
  //console.log('tag._doc: ', tag._doc.recipesWithTag)
  const transformedTag = {
    ...tag._doc,
    _id: tag._doc._id.toString(),
    recipesWithTag: () => recipeLoader.loadMany(tag._doc.recipesWithTag) 
  }
  //console.log('transformed: ', transformedTag.recipesWithTag)
  return transformedTag
}

const transformUpdatedTag =  tag => {
  //console.log('tag: ', tag)
  const transformedTag = {
    ...tag,
    _id: tag._id.toString(),
    recipesWithTag: () => recipeLoader.loadMany(tag.recipesWithTag) 
  }
  //console.log('transformed: ', transformedTag)
  return transformedTag
}

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
        const userObj = {...user._doc, _id: user.id, createdRecipes: () => recipeLoader.loadMany(user._doc.createdRecipes )}
        return userObj
    }
    catch(err) {throw err}
}



const singleRecipe = async recipeId => {
    try {
        const recipe = await recipeLoader.load(recipeId.toString())
        return recipe
    }
    catch (err) {
        throw err 
    }
}

const recipes = async recipeIds => {
    try {
        const recipes = await Recipe.find({_id: {$in: recipeIds}})
        recipes.sort((a,b) => recipeIds.indexOf(a._id.toString()) - recipeIds.indexOf(b._id.toString()))
        return recipes.map(recipe => transformRecipe(recipe))
    }
    catch (err) {throw err}
}

const tags = async tags => {
  try {
    return tags.map(tag => transformTag(tag))
  }
  catch(err) {
    throw err
  }
}






// exports.user = user;
// exports.singleRecipe = singleRecipe;
// exports.recipes = recipes;
exports.transformRecipe = transformRecipe
exports.transformTag = transformTag
exports.transformSubscription = transformSubscription