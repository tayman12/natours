const mongoose = require('mongoose');
const AppError = require('./../utils/appError');

const sendErrorDev = (error, res) => {
  console.error('ERROR: ', error);
  res.status(error.statusCode).json({
    status: error.status,
    message: error.message.charAt(0).toUpperCase() + error.message.slice(1),
    error: error,
    stack: error.stack,
  });
};

const sendErrorProd = (error, res) => {
  if (error instanceof AppError) {
    res
      .status(error.statusCode)
      .json({ status: error.status, message: error.message.charAt(0).toUpperCase() + error.message.slice(1) });
  } else {
    console.error('ERROR: ', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

const handleCastErrorDB = (error) => {
  return new AppError(`Invalid ${error.path} is ${error.value}`, 400);
};

const handleValidationErrorDB = (error) => {
  const errors = Object.values(error.errors)
    .map((el) => el.message)
    .join('. ');
  return new AppError(`Invalid input data: ${errors}`, 400);
};

const handleDuplicateFieldsDB = (error) => {
  const duplicateKeys = Object.keys(error.cause.keyValue).join(', ');
  return new AppError(`Duplicate ${duplicateKeys}, please use another value!`, 400);
};

module.exports = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(error, res);
  } else {
    console.log(error);
    if (error instanceof mongoose.Error.CastError) {
      sendErrorProd(handleCastErrorDB(error), res);
    } else if (error.cause && error.cause.code === 11000) {
      sendErrorProd(handleDuplicateFieldsDB(error), res);
    } else if (error instanceof mongoose.Error.ValidationError) {
      sendErrorProd(handleValidationErrorDB(error), res);
    } else {
      sendErrorProd(error, res);
    }
  }
};
