import { MongoClient } from "mongodb";

let dbConnection

let uri = "mongodb+srv://han:test123@cluster0.nnmpzdh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

// connect to a database
// cb is callback function -> pass in cb function as argument that we want to fire after we try to connect to the db so after the sucess of that connection attempt or after an error 
export const connectToDb = (cb) => {
    // "connect" connects to the db using the connection string
    MongoClient.connect(uri) // async task
    // returns a promise that we tack a "then" method onto, to fire a function when complete
        .then((client) => {
            // client is what we've created by connecting the db 
            dbConnection = client.db()
            // on client object is method called db which returns the db connection or interface so we can interact with db so we store it into a variable 
            cb()
        })
        // catch any errors if we try to connect
        .catch(err => {
            console.log(err)
            cb(err)
        })
}

// return our database connection after we've connected to it 
export const getDb = () => dbConnection
