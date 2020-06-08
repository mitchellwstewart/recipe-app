const mongoose = require('mongoose')
const { ingredientSchema } = require('./ingredient')
const Schema = mongoose.Schema
console.log(ingredientSchema)

const recipeSchema = new Schema({
    recipeName: {
        type: String,
        required: true,
    },
    recipeDescription: {type: String},
    recipeIngredients: [{
      name: {
        type: String,
        required: true,
      },
      amount: {
        type: String,
        required: true,
      },
      unit: {
        type: String,
      }
    }],
    recipeSteps: [{
      stepNumber:{
        type: Number,
        required: true,
      },
      stepInstruction: {
        type: String,
        required: true,
      }
    }],
    yields: {
      type: Number,
      required: true
    },
    minutesEstimate: Number,
    date: {
        type: Date,
        required: true
    },
    link: String,
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('Recipe', recipeSchema);