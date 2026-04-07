const app = require("./app");

//create and listen web server
app.listen(3000, 'localhost', () => {
    console.log("Express Server is up and running..");
    
})