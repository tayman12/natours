const fs = require('fs');
const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

console.log(`NODE_ENV is ${process.env.NODE_ENV} from app`);

// if (process.env.NODE_ENV === 'development') {
app.use(morgan('dev'));
// }

app.use(express.json());
app.use(express.static(`${__dirname}/public`));
app.set('query parser', 'extended');

app.use((req, res, next) => {
  console.log('Hello from middleware!');
  req.requestedAt = new Date().toISOString();
  next();
});

app.use('/api/v1/tours', tourRouter);

app.all('/{*splat}', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
