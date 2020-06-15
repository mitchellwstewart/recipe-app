const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const tagSchema = new Schema({
    tag: {
        type: String
    },
    recipesWithTag: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Recipe'
        }
    ]
})

module.exports = mongoose.model('Tag', tagSchema)