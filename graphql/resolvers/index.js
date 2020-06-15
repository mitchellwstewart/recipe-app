const authResolver = require('./auth')
const recipesResolver = require('./recipes')
const tagsResolver = require('./tags')
const subscriptionResolver = require('./subscription')


const rootResolver = {
    ...authResolver,
    ...recipesResolver,
    ...tagsResolver,
    ...subscriptionResolver
}

module.exports = rootResolver