const mongoose = require('mongoose');
const AppError = require('./../utils/appError');

const sendErrorDev = (error, res) => {
  res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
    error: error,
    // stack: error.stack,
  });
};

const sendErrorProd = (error, res) => {
  if (error instanceof AppError) {
    res
      .status(error.statusCode)
      .json({ status: error.status, message: error.message });
  } else {
    console.error('ERROR: ', error);
    res.status(500).json({ status: 'error', message: 'Something went wrong' });
  }
};

const handleCastErrorDB = (error) => {
  return new AppError(`Invalid ${error.path} is ${error.value}`, 400);
};

const handleValidationErrorDB = (error) => {
  const errors = Object.values(error.errors)
    .map((el) => el.message)
    .join('. ');
  return new AppError(`Invalid input data ${errors}`, 400);
};

const handleDuplicateFieldsDB = (error) => {
  const duplicateKeys = Object.keys(error.keyValue).join(', ');
  return new AppError(
    `Duplicate ${duplicateKeys}, please use another value!`,
    400,
  );
};

module.exports = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(error, res);
  } else {
    let err = { ...error };

    if (error instanceof mongoose.Error.CastError) {
      err = handleCastErrorDB(err);
    } else if (error.code === 11000) {
      err = handleDuplicateFieldsDB(err);
    } else if (error instanceof mongoose.Error.ValidationError) {
      err = handleValidationErrorDB(err);
    }

    sendErrorProd(err, res);
  }
};
