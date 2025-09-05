const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);
  console.error(err.stack);

  // Database errors
  if (err.code && err.code.startsWith('SQLITE_')) {
    return res.status(500).json({
      error: 'Database Error',
      message: 'A database error occurred'
    });
  }

  // Validation errors
  if (err.message === 'Post not found') {
    return res.status(404).json({
      error: 'Not Found',
      message: err.message
    });
  }

  // Default error
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'Something went wrong!'
  });
};

module.exports = errorHandler;