// utils/response.js
const response = (statusCode, data, message, res) => {
    res.status(statusCode).json({
      status: statusCode === 200 ? 'success' : 'error',
      data: data || null,
      message: message || null,
    });
  };
  
  module.exports = response;
  