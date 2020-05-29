const bcrypt = require('bcryptjs')
const Team = require('../../models/team')
const User = require('../../models/user')
const Name = require('../../models/name')


const names = async nameIds => {
    const names = await Name.find({_id: {$in: nameIds}})
    try {
        return names.map(name => {
            return { ...name._doc,
                 _id: name.id, creator: user.bind(this, name.creator)}
        })
    }
    catch(err) {
        console.log('WE IN THIS ERROR')
        throw err;
    }
}
const user = async userId => {
    const user = await User.findById(userId)
    try {
        console.log(" USER FROM FUNCTION: ", user)
        return { ...user._doc, _id: user.id,
             createdNames: names.bind(this, user._doc.createdNames) 
            };
    }
    catch(err) {
        throw err
    }
}

module.exports =  {
    teams: async () => {
        const teams = await Team.find()
        try {
            return teams.map(team => {
                return { ...team._doc }
            })
        }
        catch(err) {
            throw err
        }
    },
    names: async () => {
        const names = await Name.find()
        try {
            return names.map(name => {
                return { 
                    ...name._doc,
                     _id: name.id,
                      creator: user.bind(this, name._doc.creator) 
                }
            })
        }
        catch(err) {
            console.log('YES WE ARE HERE')
            throw err
        }
    },
    createTeam: async args => {
        const team = new Team({
            teamName: args.teamInput.teamName
        })
        try {
            const result = await team.save()
            console.log('results: ', result)
            return { ...result._doc, _id: results.id }
        }
        catch(err) {
            throw err
        }

    },
    createUser: async args => {
        const existingUser = await User.findOne({username: args.userInput.username})
        try {
           if(existingUser) throw new Error('User exists already')
        
        const hashPassword = await bcrypt.hash(args.userInput.password, 12)
            const user = new User({
                username:  args.userInput.username,
                password:  hashPassword
        })
        const result = await user.save()
        
            return {...result._doc, password: null, _id: result.id}
    }
        catch(err) {
            throw err;
        };
    },
    createName: async args => {
        const name = new Name({
            name: args.nameInput.name,
            creator: '5e9ccf951e86709a06a9ed2c'
        })
        let createdName;
        try {
            const result = await name.save()
        
            createdName = {...result._doc, _id: result.id, creator: user.bind(this, result._doc.creator)}
            console.log("Created NAmeL: ", createdName)
        const user = await User.findById('5e9ccf951e86709a06a9ed2c')
            if (!user) {
                throw new Error('There is no user associated. Create a user first and hardcode ID')
            }
            user.createdNames.push(name);
            await user.save()
            return createdName
        }
        catch(err) {
            console.log(err)
            throw err;
        } 
        return name
    }
}