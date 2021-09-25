
//CRUD create read update and delete 
const { MongoClient, ObjectId } = require('mongodb')

const connectionURL = 'mongodb://127.0.0.1:27017'
 const databaseName = 'nodejs-task-manager'
//const databaseName = 'new-task'


MongoClient.connect(connectionURL, { useNewURLParser: true }, (error, client) => {
    if (error) {
        return console.log('Unable to connect to db')
    }
    
    const db = client.db(databaseName)
    
//  db.collection('users').updateMany({  
//        name: 'Militus'
//     }, {
//         $set: {
//             name: 'Nnachetam'
//         }
//     }).then((result) => {
//         console.log(result)
//     }).catch((error) => {
//         console.log(error)
//     })
    
    // db.collection('new-task').updateMany({  
    //     completed: true
    // }, {
    //     $set: {
    //         completed: false
    //     }
    // }).then((result) => {
    //     console.log(result)
    // }).catch((error) => {
    //     console.log(error)
    // })
    db.collection('users').deleteMany({  
        name: "Oge'm"
    }).then((result) => {
        console.log(result)
    }).catch((error) => {
        console.log(error)
    })

    // db.collection('users').insertMany([
    //     {
    //         name: 'Ella',
    //         age: 34
    //     },  {
    //         name: 'Marcel',
    //         age: 22
    //     },  {
    //         name: 'Militus',
    //         age: 34
    //     },  {
    //         name: 'Love',
    //         age: 34
    //     }
    // ]).then((result) => {
    //     console.log(result)
    // }).catch((error) => {
    //     console.log(error)
    // })

})

