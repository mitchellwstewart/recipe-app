const Recipe = require('../../models/recipe')
const User = require('../../models/user')
const {  transformRecipe } = require ('./merge')

module.exports = {
    recipes: async () => {
        try {
            const recipes = await Recipe.find()
            return recipes.map(recipe =>  transformRecipe(recipe))
        }
        catch(err) {
            throw err
        }
    },
    createRecipe: async (args, req) => {
      console.log('create recipe: ', args.recipeInput.recipeIngredients)
        if(!req.isAuth) {
            throw new Error('Unauthenticated!')
        }
        try {
          console.log('WE ARE TRIYNG')
            const recipe = new Recipe ({
              recipeName: args.recipeInput.recipeName,
              recipeDescription: args.recipeInput.recipeDescription ,
              recipeIngredients: args.recipeInput.recipeIngredients ,
              recipeSteps: args.recipeInput.recipeSteps,
              yields: +args.recipeInput.yields,
              minutesEstimate: +args.recipeInput.minutesEstimate,
              date: new Date(args.recipeInput.date),
              link: args.recipeInput.link,
              creator: req.userId
           })
           
           let createdRecipe;
            const result = await recipe.save()
            createdRecipe = transformRecipe(result)
            const creator = await User.findById(req.userId)
            if(!creator) { throw new Error ('USER NOT FOUND') }
            creator.createdRecipes.push(recipe)
            await creator.save()
            return createdRecipe
        }
        catch(err) { 
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
            console.log('creator is here: ', creator)
            creator.createdRecipes.filter(recipe => recipe != args.recipeId)
            await creator.save()
          const result = await fetchedRecipe.delete()
          console.log('result after deltiing: ', result)
        return result._id
      }
      catch(err) { throw err }
    },
    updateRecipe:  async (args, req) => {
      console.log("ARGS FOR UPDATE: ", args)
      if(!req.isAuth) {
        console.log(
          'UNATHETINCATED'
        )
        throw new Error ('Unauthenticated')
      }
      try{
        console.log('we tring')
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
              creator: req.userId
           }}
       );
       const result =  await Recipe.findOne({_id: args.recipeId})
       console.log("RESU:LT: ", result)
       updatedRecipe = transformRecipe(result)
       console.log("update recipe: ", updatedRecipe)
        const creator = await User.findById(req.userId)
            if(!creator) { throw new Error ('USER NOT FOUND') }
            console.log('creator is here: ', creator)
            const updatedRecipes = [...creator.createdRecipes.filter(recipe => recipe != args.recipeId), updatedRecipe]
            creator.createdRecipes = updatedRecipes 
            await creator.save()
          
          console.log('result after updating: ', updatedRecipe)
        return updatedRecipe
      }
      catch(err) { 
        console.log('error: ', err)
        throw err 
      }
    }
}