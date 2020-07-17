const mongoose = require('mongoose')
const { ingredientSchema } = require('./ingredient')
const Schema = mongoose.Schema

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
      type: Number
    },
    minutesEstimate: Number,
    date: {
        type: Date,
        required: true
    },
    link: String,
    imageLinks: [{
      link:  {
        type: String,
        required: true
      }, 
      featured: {
        type: Boolean,
        default: false
      },
      public_id: {
        type: String,
        required: true
      } 
    }],
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    tags: [
      {
        tag: {
          type: String
        },
        ref: {
          type: Schema.Types.ObjectId,
          ref: 'Tag'
      }
      }
      
    ]
});

module.exports = mongoose.model('Recipe', recipeSchema);