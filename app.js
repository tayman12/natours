const fs = require('fs');
const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');

const app = express();

console.log(`NODE_ENV is ${process.env.NODE_ENV} from app`);

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use('/api/v1/tours', tourRouter);

app.use((req, res, next) => {
  console.log('Hello from middleware!');
  req.requestedAt = new Date().toISOString();
  next();
});

module.exports = app;
