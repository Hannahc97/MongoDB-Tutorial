// to start type "nodemon app" in terminal
import express from "express";
import { connectToDb, getDb } from './db.js';
import { ObjectId } from "mongodb";

const app = express();
app.use(express.json())

const PORT = 3000;

// db connection - we want to connect to db straight away before api connections
let db;

connectToDb((err)=> {
    if(!err){
        app.listen(PORT, ()=> {
            console.log(`The app is listening on port ${PORT}`)
        })
        db = getDb() // returns db connection object that we need -> this object we use in this file to interact with db so fetch save, update data
    }
})



// routes
app.get("/books", (req, res) => {

    let books = []

    db.collection("books") // collection is a function --> used to reference a specific collection in the db --> pass in whatever collection we need 
    // db.books --> we originally used this in the shell 
        .find() // returns a cursor toArray forEach 
        .sort({author: 1}) // sorts in asc for author 
        .forEach(book => { books.push(book)  // this is async as fetching batches of docs so need .then
        })
        .then(() => {
            res.status(200).json(books) // sending books array
        })
        .catch(()=>{
            res.status(500).json({error: "Could not fetch the documents"})
        })
})

app.get("/books/:id", (req, res) => {

    // evaluate to true if string id is valid 
    if(ObjectId.isValid(req.params.id)){
        db.collection("books")
        .findOne({_id: new ObjectId(req.params.id)})
        .then(doc => {
            res.status(200).json(doc) // sending the document itself we get from MongoDB
        })
        .catch(err => {
            res.status(500).json({error: "Could not fetch the document"})
        })
    } else {
        res.status(500).json({error: "Not a valid document id"})
    }
})

app.post("/books", (req, res) => {
    // want to get the body of the post request
    const book = req.body

    db.collection("books")
        .insertOne(book)
        .then(result => {
            res.status(200).json(result)
        })
        .catch(err => {
            res.status(500).json({error: "Could not create a new document"})
        })
})

app.delete("/books/:id", (req, res) => {

    if(ObjectId.isValid(req.params.id)){
        db.collection("books")
        .deleteOne({_id: new ObjectId(req.params.id)})
        .then(result => {
            res.status(200).json(result) // we get a result object back which we send to client
        })
        .catch(err => {
            res.status(500).json({error: "Could not delete the document"})
        })
    } else {
        res.status(500).json({error: "Not a valid document id"})
    }
})