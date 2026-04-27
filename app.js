const express = require('express');
const morgan = require('morgan');
const hotelRouter = require('./routers/hotelsRouter');
const userRouter = require('./routers/usersRouter');
const roomsRouter = require('./routers/roomsRouter');
const AppError = require('./utilities/appError');
const globalErrorHandler = require('./controllers/errorController');
const authRouter = require('./routers/authRouter');


//Creating express app
//get instance of express function
const app = express();

//Middleware function to get request body(req.body) in express
//json() will return middleware function thats y we calling ().
app.use(express.json());

//This middleware is to access static files(html,images) in express
//note: It takes path as argument, meaning only from this folder can access the static files by any client.
app.use(express.static('./public'))

//Morgan middleware(third party middleware)
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

//custom middleware
app.use((req,res,next) =>  {
    req.requestedAt = new Date().toISOString();
    next();
})


//Adding routes for app
app.use('/api/v1/hotels', hotelRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/rooms', roomsRouter);
app.use('/api/v1/auth', authRouter);


//Default route
app.all("*splat", (req,res,next) => {

    const error = new AppError(`Cannot find the resource ${req.originalUrl}`, 404);
    next(error);
})

//Global error handling middleware
app.use(globalErrorHandler)


module.exports = app;

