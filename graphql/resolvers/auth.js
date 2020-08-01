const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User  = require('../../models/user')
module.exports = {
  createUser: async (args, { req }) => {
      try {
          const exisitingUser = await User.findOne({email: args.userInput.email})
          if(exisitingUser) { throw new Error ('User already exists.')}
          const hashedPassword = await bcrypt.hash(args.userInput.password, 12)
          const user = new User({
              email: args.userInput.email,
              password: hashedPassword
          });
          const result = await user.save()
          
          req.session.userId = user.id
          console.log('CREATED req.session: ', req.session)
          return { ...result._doc, password: null, _id: result.id }
      }
      catch(err) {
          throw err
      }
    },
    login: async ({ email, password }, { req, res }) => {
      console.log('email :', email)
      console.log('RESOLVE CONTEXT TEST: ' , req.session)
        req.session.userId && console.log('YOU ARE ALREADY LOGGED IN: ', req.session.userId)
        const user = await User.findOne({email: email});
        if(!user) throw new Error ('User does not exist!')
        const isEqual = await bcrypt.compare(password, user.password)
        if(!isEqual) throw new Error('Password is incorrect!')
        const token = jwt.sign({userId: user.id, email: user.email}, 'somesupersecretkey', {
            expiresIn: '1h'
        });

        console.log('user.id in auth.js: ', user.id)
        req.session.userId = user.id
        return { userId: user.id, email: user.email, token: token, tokenExpiration: 1}
    },
    logout: async (args, { req, res }) => {
      try {
        const SESS_NAME = 'sid'
        console.log('Logout - destroy session:', SESS_NAME)
        if(req.session) { 
          res.clearCookie(SESS_NAME)
          req.session.destroy()
          return 'Logged Out Successfully'
        }
        else {
          throw new Error ('already logged out')
        }
      }
      catch(err) {
        throw err
      }
      
    },
    checkForUser: async (args, { req }) => {
      try {
        console.log('userID: ', req.session.userId)
        if(!req.session.userId) {
          console.log('No signed in user')
          return
        }
        console.log('checking for user session: ', req.session)
        const user = await User.findOne({_id: req.session.userId}); 
        if(!user) throw new Error ('User does not exist!')
        const token = jwt.sign({userId: user.id, email: user.email}, 'somesupersecretkey', {
          expiresIn: '1h'
      });

      console.log('RETURN: ', { userId: user.id, email: user.email, token: token, tokenExpiration: 1})
      return { userId: user.id, email: user.email, token: token, tokenExpiration: 1}
      }
      catch(err){
        console.log('err: ', err)
        throw err
      }
    }
}