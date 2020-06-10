const mongoose = require('mongoose')

const Schema = mongoose.Schema

const ingredientSchema = new Schema({
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
});

const Ingredient = mongoose.model('Ingredient', ingredientSchema);
module.exports = Ingredient