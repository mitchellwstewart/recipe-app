const bcrypt = require('bcryptjs')
const Recipe = require('../../models/recipe')
const User  = require('../../models/user')
const Subscription  = require('../../models/subscriptions')


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
        return {
            ...recipe._doc,
             _id: recipe.id,
              creator: user.bind(this, recipe.creator)
            }
    }
    catch (err) {
         throw err 
        }
}

const recipes = async recipeIds => {
    try {
        const recipes = await Recipe.find({_id: {$in: recipeIds}})
        return recipes.map(recipe => {
            return { 
                ...recipe._doc,
                _id: recipe.id,
                date: new Date(recipe._doc.date).toISOString(),
                creator: user.bind(this, recipe.creator)
            }
        })
    }
    catch (err) {throw err}
}

module.exports = {
    recipes: async () => {
        try{
            const recipes = await Recipe.find()
            return recipes.map(recipe => {
                return { 
                    ...recipe._doc,
                     _id: recipe._doc._id.toString() ,
                     date: new Date(recipe._doc.date).toISOString(),
                     creator: user.bind(this, recipe._doc.creator)
                    }
            })
        }
        catch(err) {

            throw err
        }
    },
    subscriptions: async () => {
        try {
            const subscriptions = await Subscription.find();
            return subscriptions.map(subscription => {
                return {
                    ...subscription._doc,
                    _id: subscription.id,
                    user: user.bind(this, subscription._doc.user),
                    recipe: singleRecipe.bind(this, subscription._doc.recipe),
                    createdAt: new Date(subscription._doc.createdAt).toISOString(),
                    updatedAt: new Date(subscription._doc.updatedAt).toISOString()
                }
            })
        }
        catch (err) {
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
            createdRecipe = { ...result._doc, password: null, _id: result.id, creator: user.bind(this, result._doc.creator) }
            const creator = await User.findById('5ed0a1826a0ee3220a2bec03')
            if(!creator) { throw new Error ('USER NOT FOUND') }
            creator.createdRecipes.push(recipe)
            await creator.save()
            return createdRecipe
        }
        catch(err) { throw err }
    },
    createUser: async args => {
        try {
            const exisitingUser = await User.findOne({email: args.userInput.email})
            if(exisitingUser) { throw new Error ('User already exists.')}
            const hashedPassword = await bcrypt.hash(args.userInput.password, 12)
            const user = new User({
                email: args.userInput.email,
                password: hashedPassword
            });
            const result = await user.save()
            return { ...result._doc, password: null, _id: result.id }
        }
        catch(err) {
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
        return {
            ...result._doc,
            _id: result.id,
            user: user.bind(this, subscription._doc.user),
            recipe: singleRecipe.bind(this, subscription._doc.recipe),
            createdAt: new Date(result._doc.createdAt).toISOString(),
            updatedAt: new Date(result._doc.updatedAt).toISOString() 
        }
    },
    unsubscribeFromRecipe: async args => {
        try {
            const subscription =  await Subscription.findById(args.subscriptionId).populate('recipe')
            const recipe = {
                ...subscription.recipe._doc,
                 _id: subscription.recipe.id,
                 creator: user.bind(this, subscription.recipe._doc.creator)
                }
            await Subscription.deleteOne({_id: args.subscriptionId})
            return recipe
        }
        catch (err) {
            throw err

        }
       
    }
}