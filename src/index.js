const express = require('express')
require('./db/mongoose');
const userRouter = require('./routers/users')
const taskRouter = require('./routers/tasks')

const app = express()
const port = process.env.PORT

// app.use((req, res, next) => {
//     res.status(503).send('site is under maintenance, be back shortly')
//     next()
// })

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
    console.log('Listening on port ' + port)   
})


// const Task = require('./models/task')
// const User = require('./models/user')

// const main = async () => {
    // const task = await Task.findById('613c2274daf38000745d1e6b')
    // await task.populate('owner').execPopulate()
//     // console.log(task.owner)

//     const user = await User.findById('613c226ddaf38000745d1e66')
//     await user.populate('tasks').execPopulate()
//     console.log(user.tasks)
// }

// main()