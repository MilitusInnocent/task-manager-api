const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})


//MODELS WERE HERE BEFORE THEY WERE MOVED TO THE MODELS FOLDER

// const militus = new User ({
//     name: '   Moxie  ',
//     email: ' MOXIE@YMAIL.COM   '
// })

// militus.save().then(() => {
//     console.log(militus)
// }).catch((error) => {
//     console.log('Error!', error)
// })

// const Task = mongoose.model('Task', {
//     description: {
//         type: String
//     }, 
//     completed: {
//         type: Boolean
//     }   
// })

// const job = new Task ({
//     description: 'Practiced 5 nodejs class videos today', 
//     completed: false
// })

// job.save().then(() => {
//     console.log(job)
// }).catch((error) => {
//     console.log('Error!', error)
// })
