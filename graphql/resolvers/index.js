const authResolver = require('./auth')
const recipesResolver = require('./recipes')
const subscriptionResolver = require('./subscription')


const rootResolver = {
    ...authResolver,
    ...recipesResolver,
    ...subscriptionResolver
}

module.exports = rootResolver