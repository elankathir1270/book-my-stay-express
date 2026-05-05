const express = require('express');
const morgan = require('morgan');
const hotelRouter = require('./routers/hotelsRouter');
const userRouter = require('./routers/usersRouter');
const roomsRouter = require('./routers/roomsRouter');
const AppError = require('./utilities/appError');
const globalErrorHandler = require('./controllers/errorController');
const authRouter = require('./routers/authRouter');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const sanitize = require('@exortek/express-mongo-sanitize');
const { xss } = require('express-xss-sanitizer');//returns object, from this obj we get xss().


//Creating express app

//get instance of express function
const app = express();

//set http headers to securing our app
app.use(helmet());// this function returns middlewares

//Rate limiting middleware
app.use('/api', rateLimit({
    max: 1000,
    windowMs: 60*60*1000,
    message: "We have received too many request from this ID, please try again after an hour"
}))

//Middleware function to get request body(req.body) and provide it to req object in express
//json() will return middleware function thats y we calling ().
app.use(express.json({limit: '10kb'})); // can set limit for receiving data. app.use(express.json({limit: '10kb'}));

//Data sanitization
app.use(sanitize());
app.use(xss());

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
app.use('/api/v1/auth', authRouter);
//app.use('/api/v1/rooms', roomsRouter);


//Default route
app.all("*splat", (req,res,next) => {

    const error = new AppError(`Cannot find the resource ${req.originalUrl}`, 404);
    next(error);
})

//Global error handling middleware
app.use(globalErrorHandler)


module.exports = app;

