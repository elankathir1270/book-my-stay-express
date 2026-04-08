const mongoose = require('mongoose');
const app = require("./app");



const contString = 'mongodb+srv://admin:9JmFCWyNjjWOprHo@cluster0.7035lmz.mongodb.net/bookmystay?appName=Cluster0'
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
const port = 3000;
app.listen(port, 'localhost', () => {
    console.log("Express Server is up and running..");
    
});