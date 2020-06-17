const Subscription = require ('../../models/subscriptions')
const Recipe = require ('../../models/recipe')
const Tag = require('../../models/tag')
const { transformTag } = require('./merge')

module.exports = {
  tags: async (args, req) => {
    try {
      const tags = await Tag.find()
      return tags
//      return tags.map(tag => transformTag(tag))
    }
    catch (err) {
      console.log("Err: ", err)
      throw err
    }
  },
  addTagToRecipe: async (args, req) => {
      if(!req.isAuth) {
          throw new Error('Unauthenticated!')
      }
      try {
        let result;
        const exisitingTag = await tag.findOne({tag: args.tag})
        //const fetchedRecipe = await Recipe.findOne({_id: req.recipeId})
        if (exisitingTag) { 
          //console.log('Tag already exists, just add it to the recipe')
          exisitingTag.recipesWithTag.push()
          result = exisitingTag
        }
        else {
          //console.log('This is a new tag, created in database and add it to the recipe')
          const newTag = new Tag({
            tag: args.tag,
            recipesWithTag: [req.recipeId]
          })
          result = await newTag.save();
        }
        
        console.log("result: ", result)
        
        //return transformSubscription(result)
      }
      catch (err) {
        throw err
      }
      
  },
  // removeTagFromRecipe: async (args, req) => {
  //     if(!req.isAuth) {
  //         throw new Error('Unauthenticated!')
  //     }
  //     try {
  //         const subscription =  await Subscription.findById(args.subscriptionId).populate('recipe')
  //         const recipe = transformRecipe(subscription.recipe)
  //         await Subscription.deleteOne({_id: args.subscriptionId})
  //         return recipe
  //     }
  //     catch (err) {
  //         throw err
  //     }
  // }
}