const express = require('express');
const bodyParser = require('body-parser');
// const cors = require('cors')
const mongoose = require('mongoose');
const graphQlSchema = require('./graphql/schema/index');
const graphQlResolvers = require('./graphql/resolvers/index');
const app = express();
const graphqlHttp = require('express-graphql');
const isAuth = require('./middleware/is-auth');
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)

// app.set('trust proxy', 1)
const ONE_HOUR = 1000 * 60 //one minute
const IN_PROD = process.env.NODE_ENV === 'production'
const SESS_NAME = 'sid'
const SESS_SECRET = 'ssh!secret'
app.use(session({
  name: SESS_NAME,
  secret: SESS_SECRET,
  resave: false,
  rolling: false,
  saveUninitialized: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  cookie: {
    secure: app.get('env') === 'production',
    maxAge: 120 * 1000
  }
}))

app.use(bodyParser.json({limit: '50mb', extended: true}))
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}))

app.use((req, res, next) => {
  next()
}, (req, res, next)=>{
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
  res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Set-Cookie')
  res.setHeader('Access-Control-Expose-Headers', 'Set-Cookie')
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  if(req.method === 'OPTIONS') {
    return res.sendStatus(200)
  }
  next();
})


app.use(isAuth, (req, res, next)=>{
  console.log('session userId: ', req.session.userId)
  next()
})

app.use('/graphql', 
graphqlHttp((req, res, next) => ({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
    graphiql: true,
    context:  {
      req: req,
      res: res,
      test: 'Hello World'
    }
})))
mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-wujcz.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`)
.then(() => {
  const port = process.env.PORT || 3001
    app.listen(port)
}).catch(err=>{
    console.log("error: ", err)
})

