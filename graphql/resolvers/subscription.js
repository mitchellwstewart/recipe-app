
const Subscription = require ('../../models/subscriptions')
const Recipe = require ('../../models/recipe')
const { transformSubscription, transformRecipe} = require('./merge')

module.exports = {
    subscriptions: async (args, req) => {
        if(!req.isAuth) {
            throw new Error('Unauthenticated!')
        }
        try {
            const subscriptions = await Subscription.find();
            return subscriptions.map(subscription => transformSubscription(subscription))
        }
        catch (err) {
            throw err
        }
    },
    subscribeToRecipe: async (args, req) => {
        if(!req.isAuth) {
            throw new Error('Unauthenticated!')
        }
        const fetchedRecipe = await Recipe.findOne({_id: args.recipeId})
        const subscription = new Subscription({
            user: req.userId,
            recipe: fetchedRecipe
        })
        const result = await subscription.save();
        return transformSubscription(result)
    },
    unsubscribeFromRecipe: async (args, req) => {
        if(!req.isAuth) {
            throw new Error('Unauthenticated!')
        }
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
