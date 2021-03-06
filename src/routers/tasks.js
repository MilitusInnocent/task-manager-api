const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/tasks', auth, async (req, res) => {
    //const task = new Task(req.body)
    const task = new Task ({
        ...req.body,
        owner: req.user._id
    })

    try {
        await task.save()
        res.status(201).send({
            status: true,
            data: task,
            message: 'Task created successfully'
        }) 
    } catch (error) {
        res.status(400).send(error)
    }
    // task.save().then(() => {
    //     res.status(201).send(task)
    // }).catch((error) => {
    //     res.status(400).send(error)
    // })
})

//GET /tasks?completed=true
//GET /tasks?limit=10&skip=20
router.get('/tasks', auth, async (req, res) => {
    const match = {}

    if (req.query.completed) {
        match.completed = req.query.completed ==='true'
    }

    try {
        //const tasks = await Task.find({})
        await req.user.populate({
            path:'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip)
            }
        }).execPopulate()
        res.send({
            status: true,
            data: req.user.tasks,
            message: 'Tasks fetched successfully'
        })
    } catch (error) {
        res.status(500).send(error)
    }

    // Task.find({}).then((tasks) => {
    //     res.status(201).send(tasks)
    // }).catch((error) => {
    //     res.status(500).send(error)
    // })
})

router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id

    try {
        const task = await Task.findOne({ _id, owner: req.user._id })
        if (!task) {
            return res.status(404).send()
        }
        res.send({
            status: true,
            data: task,
            message: 'Task fetched successfully'
        })
    } catch (error) {
        res.status(500).send(error)
    }

    // Task.findById(_id).then((task) => {
    //     if (!task) {
    //         return res.status(404).send()
    //     }
        
    //     res.send(task)
    // }).catch((error) => {
    //     res.status(500).send()
    // })
})

router.put('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => { // shortcut: updates.every((update) => allowedUpdates.includes(update))
        return allowedUpdates.includes(update)
    })

    if (!isValidOperation) {
        return res.status(400).send({ status: false, error: 'Invalid Updates!'})
    }

    try {
        const task = await Task.findOne({_id: req.params.id, owner: req.user._id})

      if (!task) {
        return  res.status(404).send()
      }
      updates.forEach((update) => task[update] = req.body[update])
      await task.save()
      res.status(201).send({
        status: true,
        data: task,
        message: 'Task updated successfully'
    }) 
    } catch (error) {
        res.status(400).send()
    }

})

router.delete('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id

    try {
        const task = await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id});
 
        if (!task) {
            return res.status(404).send()
        }
        res.send({
            status: true,
            message: 'Task deleted successfully'
        })
        
    } catch (error) {
        res.status(500).send(error)
    }
})



module.exports = router;