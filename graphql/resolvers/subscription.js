
const Subscription = require ('../../models/subscriptions')
const Recipe = require ('../../models/recipe')
const { transformSubscription, transformRecipe} = require('./merge')



module.exports = {
    subscriptions: async () => {
        try {
            const subscriptions = await Subscription.find();
            return subscriptions.map(subscription => transformSubscription(subscription))
        }
        catch (err) {
            throw err
        }
    },
    subscribeToRecipe: async args => {
        const fetchedRecipe = await Recipe.findOne({_id: args.recipeId})
        const subscription = new Subscription({
            user: '5ed0a1826a0ee3220a2bec03',
            recipe: fetchedRecipe
        })
        const result = await subscription.save();
        return transformSubscription(result)
    },
    unsubscribeFromRecipe: async args => {
        try {
            const subscription =  await Subscription.findById(args.subscriptionId).populate('recipe')
            const recipe = transformRecipe(subscription.recipe)
            await Subscription.deleteOne({_id: args.subscriptionId})
            return recipe
        }
        catch (err) {
            throw err

        }
    }
}
