const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    }, email: {
        type: String,
        unique: true,
        trim: true,
        lowercase: true,
        validate (value){
            if(!validator.isEmail(value)) {
                throw new Error ('Invalid email entered')
            }
        }
    }, password: {
        type: String,
        required: true,
        trim: true,
        minLength: 7,
        validate (value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error ('Password cannot contain "password"')
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error ('Age has to be a positive number for this to work')
            }
        }
    }, 
    tokens: [{
        token:{
            type: String,
            required: true
        }
    }], 
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
})

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.methods.toJSON = function () {
    const userObject = this.toObject()
    
    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject
}

//note, when using the 'this' keyword, you can't use an arrow function. Make sure it is the standard function
userSchema.methods.generateAuthToken = async function () {
    const token = jwt.sign({ _id: this._id.toString() }, process.env.JWT_SECRET)

    this.tokens = this.tokens.concat({ token })
    await this.save()
    return token
}

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })

    if (!user) {
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error ('Email or Password is incorrect, check and try again')
    }

    return user
}


//hash the plain text password before saving
userSchema.pre('save',  async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8)
    }

    next()
})

//Delete user tasks when user is removed
userSchema.pre('remove',  async function (next) {
    await Task.deleteMany({ owner: this._id })

    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User;