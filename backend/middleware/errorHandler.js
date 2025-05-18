const logger = require('../utils/logger');

exports.errorHandler = (err, req, res, next) => {
  // Log the error
  logger.error(`${err.name}: ${err.message}`, { stack: err.stack });
  
  // Determine error status code
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  // Handle specific error types
  if (err.name === 'ValidationError') {
    statusCode = 400;
  }
  
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 404;
    err.message = 'Resource not found';
  }
  
  if (err.code === 11000) {
    statusCode = 400;
    err.message = 'Duplicate key error';
  }
  
  // Handle multer errors
  if (err.name === 'MulterError') {
    statusCode = 400;
    switch (err.code) {
      case 'LIMIT_FILE_SIZE':
        err.message = `File too large. Maximum size is ${process.env.MAX_FILE_SIZE / 1000000}MB`;
        break;
      case 'LIMIT_FILE_COUNT':
        err.message = 'Too many files uploaded';
        break;
      default:
        err.message = 'File upload error';
    }
  }
  
  // Send response
  res.status(statusCode).json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};