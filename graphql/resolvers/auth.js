const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User  = require('../../models/user')
module.exports = {
    createUser: async args => {
        try {
            const exisitingUser = await User.findOne({email: args.userInput.email})
            if(exisitingUser) { throw new Error ('User already exists.')}
            const hashedPassword = await bcrypt.hash(args.userInput.password, 12)
            const user = new User({
                email: args.userInput.email,
                password: hashedPassword
            });
            const result = await user.save()
            return { ...result._doc, password: null, _id: result.id }
        }
        catch(err) {
            throw err
        }
        
    },
    login: async ({ email, password }) => {
      console.log('login email: ', email)
      console.log('login password: ', password)
        const user = await User.findOne({email: email});
        if(!user) {
          console.log('USER DOESNt exist')
            throw new Error ('User does not exist!')
        }
        const isEqual = await bcrypt.compare(password, user.password)
        if(!isEqual) {
            throw new Error('Password is incorrect!')
        }
        const token = jwt.sign({userId: user.id, email: user.email}, 'somesupersecretkey', {
            expiresIn: '1h'
        });
        return { userId: user.id, token: token, tokenExpiration: 1}
    }
}