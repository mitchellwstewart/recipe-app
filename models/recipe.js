const mongoose = require('mongoose')

const Schema = mongoose.Schema

const recipeSchema = new Schema({
    recipeName: {
        type: String,
        required: true,
    },
    recipeDescription: {type: String},
    recipeIngredients: {
        type: String
    },
    recipeSteps: {
        type: String
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