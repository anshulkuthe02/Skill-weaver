// Global error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error('Error occurred:', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    userId: req.user?.id,
    timestamp: new Date().toISOString()
  });

  // Default error
  let error = { ...err };
  error.message = err.message;

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = {
      message,
      statusCode: 404
    };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `${field} already exists`;
    error = {
      message,
      statusCode: 400,
      field
    };
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = {
      message,
      statusCode: 400,
      validationErrors: Object.keys(err.errors)
    };
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = {
      message: 'Invalid token',
      statusCode: 401
    };
  }

  if (err.name === 'TokenExpiredError') {
    error = {
      message: 'Token expired',
      statusCode: 401
    };
  }

  // File upload errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    error = {
      message: 'File too large',
      statusCode: 413,
      maxSize: process.env.MAX_FILE_SIZE
    };
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    error = {
      message: 'Unexpected file field',
      statusCode: 400
    };
  }

  // OpenAI API errors
  if (err.response?.status) {
    const status = err.response.status;
    let message = 'AI service error';
    
    switch (status) {
      case 401:
        message = 'AI service authentication failed';
        break;
      case 429:
        message = 'AI service rate limit exceeded';
        break;
      case 500:
        message = 'AI service temporarily unavailable';
        break;
    }
    
    error = {
      message,
      statusCode: status === 429 ? 429 : 503,
      service: 'openai'
    };
  }

  // Rate limiting errors
  if (err.type === 'entity.too.large') {
    error = {
      message: 'Request entity too large',
      statusCode: 413
    };
  }

  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';

  // Prepare error response
  const errorResponse = {
    success: false,
    error: message,
    ...(error.field && { field: error.field }),
    ...(error.validationErrors && { validationErrors: error.validationErrors }),
    ...(error.service && { service: error.service }),
    ...(error.maxSize && { maxSize: error.maxSize }),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
    method: req.method
  };

  // Send error response
  res.status(statusCode).json(errorResponse);
};

// 404 handler
const notFound = (req, res) => {
  const message = `Route ${req.originalUrl} not found`;
  console.log(`404 - ${message}`);
  
  res.status(404).json({
    success: false,
    error: 'Not Found',
    message,
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString()
  });
};

// Async handler wrapper to catch async errors
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
  errorHandler,
  notFound,
  asyncHandler
};
