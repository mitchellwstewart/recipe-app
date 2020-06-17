const Recipe = require('../../models/recipe')
const User = require('../../models/user')
const Tag = require('../../models/tag')
const {  transformRecipe, transformTag } = require ('./merge')

const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
  }
}
const findOrCreateTags = async (recipeTags, recipe) => {
  let verifiedTags = []
  if(recipe) { recipe = transformRecipe(recipe) }
  await asyncForEach(recipeTags, async ({ tag }) => {
    let tagResult = await Tag.findOne({tag: tag});
    if(!tagResult) tagResult = await new Tag ({ tag: tag, recipesWithTag: [] })
      const updatedRecipes = recipe 
      ? tagResult.recipesWithTag.length 
        ? [...tagResult.recipesWithTag.filter(existingRecipe => existingRecipe != recipe._id), recipe._id]
        : [recipe._id]
      : []
      tagResult.recipesWithTag = updatedRecipes
      await tagResult.save()
      verifiedTags.push({tag: tagResult.tag, _id: tagResult._id})
    })
    return verifiedTags
}

const removeRecipeFromTag =  async (tagsForRecipeRemoval, recipeId) => {
  await asyncForEach(tagsForRecipeRemoval, async(tag) => {
    tag = transformTag(tag)
    const tagResult = await Tag.findById(tag._id) 
    tagResult.recipesWithTag = tagResult.recipesWithTag.filter(id => {
      return id != recipeId
    })
    await tagResult.save()
  })
}



module.exports = {
    recipes: async (args, req) => {
        try {
            const recipes = await Recipe.find()
            return recipes.map(recipe =>  transformRecipe(recipe))
        }
        catch(err) {
            throw err
        }
    },
    createRecipe: async (args, req) => {
      if(!req.isAuth) {
          throw new Error('Unauthenticated!')
      }
      try {
        let verifiedTags = await findOrCreateTags(args.recipeInput.tags);
        const recipe = new Recipe ({
          recipeName: args.recipeInput.recipeName,
          recipeDescription: args.recipeInput.recipeDescription ,
          recipeIngredients: args.recipeInput.recipeIngredients ,
          recipeSteps: args.recipeInput.recipeSteps,
          yields: +args.recipeInput.yields,
          minutesEstimate: +args.recipeInput.minutesEstimate,
          date: new Date(args.recipeInput.date),
          link: args.recipeInput.link,
          imageLinks: args.recipeInput.imageLinks,
          creator: req.userId
        })
        const recipeResult = await recipe.save()
        let updatedTagsWithRecipes = await findOrCreateTags( verifiedTags, recipeResult)
        recipeResult.tags.push(...updatedTagsWithRecipes) // FIXME: Async recipesWithTag promise array not showing up. See in merge.js
        recipeResult.save()
        let createdRecipe = transformRecipe(recipeResult)
        const creator = await User.findById(req.userId)
        if(!creator) { throw new Error ('USER NOT FOUND') }
        creator.createdRecipes.push(recipe)
        await creator.save()
        return createdRecipe
      }
      catch(err) { 
        console.log('err: ', err)
        throw err 
      }
    },
    deleteRecipe:  async (args, req) => {
      if(!req.isAuth) {
        throw new Error ('Unauthenticated')
      }
      try{
        const fetchedRecipe = await Recipe.findOne({_id: args.recipeId})
        if(req.userId.toString() !== fetchedRecipe.creator.toString()) {
          throw new Error ('Unauthenticated: User does not own recipe')
        }

        const creator = await User.findById(req.userId)
            if(!creator) { throw new Error ('USER NOT FOUND') }
            creator.createdRecipes.filter(recipe => recipe != args.recipeId)
            await creator.save()
          const result = await fetchedRecipe.delete()
        return result._id
      }
      catch(err) { throw err }
    },
    updateRecipe:  async (args, req) => {
      if(!req.isAuth) {
        throw new Error ('Unauthenticated')
      }
      try{
        let recipeBeforeUpdate =  await Recipe.findOne({_id: args.recipeId})
        const newTagData = {}
        args.recipeInput.tags.forEach(tagObj => newTagData[tagObj.tag] = tagObj)
         const tagsToRemove = recipeBeforeUpdate.tags.filter(tagObj =>  !newTagData[tagObj.tag] && tagObj)
         const updatedTagsWithRecipe = await findOrCreateTags(args.recipeInput.tags, recipeBeforeUpdate)
        await Recipe.updateOne(
          {_id: args.recipeId},
          { $set: {
              recipeName: args.recipeInput.recipeName,
              recipeDescription: args.recipeInput.recipeDescription ,
              recipeIngredients: args.recipeInput.recipeIngredients ,
              recipeSteps: args.recipeInput.recipeSteps ,
              yields: +args.recipeInput.yields,
              minutesEstimate: +args.recipeInput.minutesEstimate,
              date: new Date(args.recipeInput.date),
              link: args.recipeInput.link,
              imageLinks: args.recipeInput.imageLinks,
              creator: req.userId,
          }}
        );
        await removeRecipeFromTag(tagsToRemove, args.recipeId)
        const result =  await Recipe.findOne({_id: args.recipeId})
        result.tags = updatedTagsWithRecipe
        result.save()

        updatedRecipe = transformRecipe(result)
         const creator = await User.findById(req.userId)
         if(!creator) { throw new Error ('USER NOT FOUND') }
         const updatedRecipes = [...creator.createdRecipes.filter(recipe => recipe != args.recipeId), updatedRecipe]
         creator.createdRecipes = updatedRecipes 
         await creator.save()
         return updatedRecipe
      }
      catch(err) { 
        throw err 
      }
    },
    

}