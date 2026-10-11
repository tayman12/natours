const fs = require('fs');
const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use('/api/v1/tours', tourRouter);

app.use((req, res, next) => {
  console.log('Hello from middleware!');
  req.requestedAt = new Date().toISOString();
  next();
});

const port = 8080;
app.listen(port, () => {
  console.log(`Server is running on port ${port}...`);
});
