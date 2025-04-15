// Custom Error Class
class CustomError extends Error {

    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = statusCode >= 400 && statusCode < 500 ? "Source: Custom Error Class: Client Error" : "Source: Custom Error Class: Internal Server Error";
        Error.captureStackTrace(this, this.constructor);
    }
};

module.exports = CustomError;
