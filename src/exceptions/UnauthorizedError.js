class UnauthorizedError extends Error {
    constructor(message = 'You are not logged in', statusCode = 401) {
      super(message);
      this.statusCode = statusCode;
      this.name = 'UnauthorizedError';
    }
  }
  
  module.exports = UnauthorizedError;
  