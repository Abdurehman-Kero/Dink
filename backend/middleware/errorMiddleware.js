const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;
  
  // Prisma validation errors
  if (err.name === 'PrismaClientValidationError') {
    statusCode = 400;
    message = 'Invalid request payload';
  }
  
  // Prisma unique constraint error
  if (err.code === 'P2002') {
    statusCode = 400;
    message = 'A record with this value already exists';
  }

  // Prisma not found error
  if (err.code === 'P2025') {
    statusCode = 404;
    message = 'Requested resource not found';
  }
  
  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }
  
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }
  
  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : null
  });
};

module.exports = { errorHandler };
