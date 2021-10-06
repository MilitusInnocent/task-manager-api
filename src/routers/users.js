const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const sharp = require('sharp')
const multer = require('multer')
const { sendWelcomeEmail, sendCancellationEmail } = require('../emails/account')
const router = new express.Router()


router.post('/users', async (req, res) => {
    const user = new User(req.body)
    
    try {
        await user.save()
        sendWelcomeEmail(user.email, user.name)
        const token = await user.generateAuthToken();
        res.status(201).send({
            status: true,
            data: user, 
            token,
            message: 'User created successfully'
        })
    } catch (error) {
        if(error.name === 'MongoError' && error.code === 11000) {
             res.status(400).send({
                status: false,
                error: 'Email already exist in the database'
            }) 
        } else if (error.errors.password.name === 'ValidatorError'){
            res.status(400).send({
                status: false,
                error: error.message
            })
        } else {
            res.status(500).send({
                status: false,
                message: 'Someting went wrong'
            })
        } 
        
    }

    // user.save().then(() => {
    //     res.status(201).send(user)
    // }).catch((error) => {
    //     res.status(400).send(error)
    // })
})

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken();
        res.status(200).send({
            status: true,
            data: user, 
            token,
            message: 'User logged in successfully'
        })
    } catch (error) {
        res.status(400).send({
            status: false,
            error: 'Invalid credentials provided'
        })
    }
}) 

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send({
            status: true,
            message: 'successfully logged out'
        })
    } catch (error) {
        res.status(500).send({
            status: false,
            message: 'Someting went wrong'
        })
    }
})

// router.post('/users/logoutAll', auth, async (req, res) => {
//     try {
//         req.user.tokens = []
//         await req.user.save()
//         res.send('successfully logged out of all devices')
//         await req.user.save()
//         res.send('successfully loggd out')
//     } catch (error) {
//         res.status(500).send()
//     }
// })

router.get('/users/me', auth, async (req, res) => {

  res.send({
      status: true,
      data: req.user,
      message: 'User profile fetched successfully'
    })
    // User.find({}).then((users) => {
    //     res.status(201).send(users)
    // }).catch((error) => {
    //     res.status(500).send(error)
    // })
})

router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => { // shortcut: updates.every((update) => allowedUpdates.includes(update))
        return allowedUpdates.includes(update)
    })

    if (!isValidOperation) {
        return res.status(400).send({ 
            status: false,
            error: 'Invalid Updates!'
        })
    }

    try {
        const user = await User.findById(req.user._id)

        updates.forEach((update) => req.user[update] = req.body[update])

        await req.user.save()

        res.send({
            status: true,
            data: req.user,
            message: 'User updated successfully'
          })
    } catch (error) {
        if(error.name === 'MongoError' && error.code === 11000) {
             res.status(400).send({
                status: false,
                error: 'Email already exist in the database'
            }) 
        } else if (error.errors.password.name === 'ValidatorError'){
            res.status(400).send({
                status: false,
                error: error.message
            })
        } else {
            res.status(500).send({
                status: false,
                message: 'Someting went wrong'
            })
        } 
        
    }

})

router.delete('/users/me', auth, async (req, res) => {

    try {
        // const user = await User.findByIdAndDelete(user._id);
 
        // if (!user) {
        //     return res.status(404).send() // the if condition does not stand anymore cos auth has taken care of it.
        // }
        await req.user.remove()
        sendCancellationEmail(req.user.email, req.user.name)
        res.send({
            status: true,
            message: 'User deleted successfully'
        })
        
    } catch (error) {
        res.status(500).send({
            status: false,
            error
        })
    }
})

const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, callback) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
           return callback(new Error('Only images are allowed')) 
        }

        callback(undefined, true)
    }
})

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250}).png().toBuffer()
    req.user.avatar = buffer    
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send( { status: false, error: error.message })
})

router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send({
        status: true,
        message: 'Avatar deleted successfully'
    })
}, (error, req, res, next) => {
    res.status(400).send( { status: false, error: error.message })
})

router.get('/users/:id/avatar', async (req, res) => {

    try {
        const user = await User.findById(req.params.id)

        if (!user || !user.avatar) {
            throw new Error()
        }

        res.set('Content-type', 'image/png')
        res.send({
            status: true, 
            data: user.avatar})
    } catch (error) {
        res.status(404).send({
            status: false, 
            error
        })
    }
})


module.exports = router;