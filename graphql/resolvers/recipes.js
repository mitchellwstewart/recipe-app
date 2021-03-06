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

  if(recipe) { 
    //console.log('existing recipe: ', recipe._id)
    //recipe = transformRecipe(recipe) 
    //console.log('transformed recipe: ', recipe._id)
  }
  await asyncForEach(recipeTags, async ({ tag }) => {
    let tagResult = await Tag.findOne({tag: tag});
    //console.log("TAG RESULT: ", tagResult)
    if(!tagResult) tagResult = await new Tag ({ tag: tag, recipesWithTag: [] })
      const updatedRecipes = recipe 
      ? tagResult.recipesWithTag.length 
        ? [...tagResult.recipesWithTag.filter(existingRecipe => existingRecipe !== recipe._id), recipe._id]
        : [recipe._id]
      : []
      tagResult.recipesWithTag = updatedRecipes
      await tagResult.save()

      let verifiedTag = {
        tag: tagResult.tag,
         _id: tagResult._id,
        recipesWithTag: tagResult.recipesWithTag
      }
      //console.log('verifieddTag: ', verifiedTag)
      verifiedTags.push(tagResult)
    })
    //console.log('verifiedTags: ', verifiedTags)
    return verifiedTags
}
const removeRecipeFromTag =  async (tagsForRecipeRemoval, recipeId) => {
  await asyncForEach(tagsForRecipeRemoval, async(tag) => {
    tag = transformTag(tag)
    const tagResult = await Tag.findById(tag._id) 
    tagResult.recipesWithTag = tagResult.recipesWithTag.filter(id => {
      return id !== recipeId
    })
    !tagResult.recipesWithTag.length ? await tagResult.delete() : await tagResult.save()
  })
}



module.exports = {
    recipes: async (args, { req, res } ) => {
        try {
            const recipes = await Recipe.find()
            //console.log('RECIPES req.session: ', req.session)
             return recipes.map(recipe =>  {
              //recipe._doc.tags.forEach(tag => console.log('fpr each tag: ', tag._doc))
              return transformRecipe(recipe)
              })
        }
        catch(err) {
            throw err
        }
    },
    createRecipe: async (args, { req }) => {
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
        recipeResult.tags.push(...updatedTagsWithRecipes) 
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
    deleteRecipe:  async (args, { req }) => {
      console.log("Req: ", req)
      if(!req.isAuth) {
        throw new Error ('Unauthenticated')
      }
      try{
        const fetchedRecipe = await Recipe.findOne({_id: args.recipeId})
        if(req.userId.toString() !== fetchedRecipe.creator.toString()) {
          throw new Error ('Unauthenticated: User does not own recipe')
        }
        
        const recipeTags = fetchedRecipe.tags
        await removeRecipeFromTag(recipeTags, args.recipeId)
        const creator = await User.findById(req.userId)
        if(!creator) { throw new Error ('USER NOT FOUND') }
        creator.createdRecipes = creator.createdRecipes.filter(recipe => recipe !== args.recipeId)
        await creator.save()
        const result = await fetchedRecipe.delete()
        return result._id
      }
      catch(err) { throw err }
    },
    updateRecipe:  async (args, { req }) => {
      console.log('CREATED RECIPE IMAGES: ', args.recipeInput.imageLinks)
      console.log('req: ', req)
      if(!req.isAuth) {
        console.log('no auth')
        throw new Error ('Unauthenticated')
      }
      try{
        let recipeBeforeUpdate =  await Recipe.findOne({_id: args.recipeId})
        const newTagData = {}
        args.recipeInput.tags.forEach(tagObj => newTagData[tagObj.tag] = tagObj)
         const tagsToRemove = recipeBeforeUpdate.tags.filter(tagObj =>  !newTagData[tagObj.tag] && tagObj)
         
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
        const updatedTagsWithRecipe = await findOrCreateTags(args.recipeInput.tags, recipeBeforeUpdate)
        await removeRecipeFromTag(tagsToRemove, args.recipeId)
        const result =  await Recipe.findOne({_id: args.recipeId})
        //console.log("updatedTagsWithRecipe: ", updatedTagsWithRecipe)
        result.tags = updatedTagsWithRecipe
        result.save()
          //result._doc.tags.forEach(tag => console.log('fpr each tag: ', tag._doc))
        updatedRecipe = transformRecipe(result)
        //console.log('updatedRecipe: ', updatedRecipe)
         const creator = await User.findById(req.userId)
         if(!creator) { throw new Error ('USER NOT FOUND') }
         const updatedRecipes = [...creator.createdRecipes.filter(recipe => recipe !== args.recipeId), updatedRecipe]
         creator.createdRecipes = updatedRecipes 
         await creator.save()
         console.log('updatedRecipe: ', updatedRecipe)
         return updatedRecipe
      }
      catch(err) { 
        throw err 
      }
    },
    

}