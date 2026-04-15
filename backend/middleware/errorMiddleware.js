const errorHandler = (err, req, res, next) => {
  // If the status code is a successful 200 but an error was thrown, default to a 500 server error
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    message: err.message,
    // Only show the detailed stack trace if you are in development mode, not in production
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = {
  errorHandler,
};