const Subscription = require ('../../models/subscriptions')
const Recipe = require ('../../models/recipe')
const Tag = require('../../models/tag')
const { transformTag } = require('./merge')

module.exports = {
  tags: async (args, req) => {
    try {
      const tags = await Tag.find()
      return tags
    }
    catch (err) { throw err }
  },
}