const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');
const graphQlSchema = require('./graphql/schema/index');
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const Recipe = require('./models/recipe')
const User  = require('./models/user')

//const graphQlResolvers = require('./graphql/resolvers/index')

const app = express();
app.use(bodyParser.json());

app.use('/graphql', graphqlHttp({
    schema: graphQlSchema,
    rootValue: {
        recipes: () => {
            return Recipe.find()
            .then(recipes => {
                return recipes.map(event => {
                    return { ...event._doc, _id: event._doc._id.toString() }
                })
            }).catch(err => {
                throw err
            })
        },
        createRecipe: (args) => {
            const recipe = new Recipe ({
                 recipeName: args.recipeInput.recipeName,
                 recipeDescription: args.recipeInput.recipeDescription ,
                 recipeIngredients: args.recipeInput.recipeIngredients ,
                 recipeSteps: args.recipeInput.recipeSteps ,
                 minutesEstimate: +args.recipeInput.minutesEstimate,
                 date: new Date(args.recipeInput.date),
                 link: args.recipeInput.link,
                 creator: "5ed0543a96a037149b91ad61"
            })
            let createdRecipe;
           return recipe
           .save()
           .then(result => {
               createdRecipe = { ...result._doc, password: null, _id: result.id }
               return User.findById('5ed0543a96a037149b91ad61')
            })
            .then(user => {
                if(!user) {
                    throw new Error ('USER NOT FOUND')
                }
                user.createdRecipes.push(recipe)
                return user.save()
            })
            .then(result => {
                return createdRecipe
            })
            .catch(err => {
                console.log(err)
                throw err;   
            });
            
        },
        createUser: args => {
            return User.findOne({email: args.userInput.email}).then(user => {
                if(user) {
                    throw new Error ('User already exists.')
                }
                return bcrypt.hash(args.userInput.password, 12)
            }).then(hashedPassword => {
                const user = new User({
                    email: args.userInput.email,
                    password: hashedPassword
                });
                return user.save()
            })
            .then(result => {
                return { ...result._doc, password: null, _id: result.id }
            })
            .catch(err => {throw err})
        }
    },
    graphiql: true
}))

app.get('/', (req, res, next) => {
    res.send('Hello World!')
})

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-wujcz.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`)
.then( () => {
    app.listen(3001)
}).catch(err=>{
    console.log("error: ", err)
})

