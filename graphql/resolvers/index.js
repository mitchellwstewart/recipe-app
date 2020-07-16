const authResolver = require('./auth')
const recipesResolver = require('./recipes')
const tagsResolver = require('./tags')
const subscriptionResolver = require('./subscription')
const cloudinaryResolver = require('./cloudinary')


const rootResolver = {
    ...authResolver,
    ...recipesResolver,
    ...tagsResolver,
    ...subscriptionResolver,
    ...cloudinaryResolver
}

module.exports = rootResolver