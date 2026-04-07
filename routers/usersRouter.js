const express = require('express');

const usersRouter = express.Router();

//param middleware
const paramMiddleware = (req,res,next,value,name) => {
    console.log("Id route parameter value: " + value);
    next(); 
}

usersRouter.param('id', paramMiddleware);

usersRouter.get('/', (req,res) => {
    res.send("sending all users");
})

usersRouter.get('/:id', (req,res) => {
    res.send(`sending user with id ${req.params.id}`)
})


module.exports = usersRouter;