const mongoose = require('mongoose');
const dotenv = require("dotenv");
dotenv.config({
    path: "./config.env"
})

//Handling uncaught exception (sync code)
process.on('uncaughtException', (error) => {
    console.log(error.name +" : " + "error.message");
    console.log("Uncaught exception occurred. shutting down");
    process.exit(1);   
})

const app = require("./app");

const contString = process.env.CONNECTION_STRING
mongoose.connect(contString)
.then((conn) => console.log('Connection to db successful'))
.catch((err) => console.error('Could not connect to MongoDB', err))

// //mongoose event - just for reference
// const db = mongoose.connection
// //this event will be raised for any reason connection is cut between mongoDB and express. 
// db.on('disconnected', () => {
//     console.log("MongoDB connection is disconnected");   
// })


//create and listen web server
const port = process.env.PORT | 3000;
const server = app.listen(port, () => {
    console.log("Express Server is up and running..");
    
});

//Handling rejected promise globally
process.on('unhandledRejection', (error) => {
    console.log(error.name +" : " + "error.message");
    console.log("Unhandled rejection occurred. shutting down");

    server.close(() => {
        process.exit(1);
    })    
}) 