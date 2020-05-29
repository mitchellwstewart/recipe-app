const Recipe = require('../../models/recipe')
const {  transformRecipe } = require ('./merge')


module.exports = {
    recipes: async () => {
        try{
            const recipes = await Recipe.find()
            return recipes.map(recipe =>  transformRecipe(recipe))
        }
        catch(err) {

            throw err
        }
    },
    createRecipe: async args => {
        try {
            const recipe = new Recipe ({
                recipeName: args.recipeInput.recipeName,
                recipeDescription: args.recipeInput.recipeDescription ,
                recipeIngredients: args.recipeInput.recipeIngredients ,
                recipeSteps: args.recipeInput.recipeSteps ,
                minutesEstimate: +args.recipeInput.minutesEstimate,
                date: new Date(args.recipeInput.date),
                link: args.recipeInput.link,
                creator: "5ed0a1826a0ee3220a2bec03"
           })
           let createdRecipe;
            const result = await recipe.save()
            createdRecipe = transformRecipe(result)
            const creator = await User.findById('5ed0a1826a0ee3220a2bec03')
            if(!creator) { throw new Error ('USER NOT FOUND') }
            creator.createdRecipes.push(recipe)
            await creator.save()
            return createdRecipe
        }
        catch(err) { throw err }
    }
}