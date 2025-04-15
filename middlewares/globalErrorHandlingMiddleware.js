function globalErrorHandlingMiddleware(error, req, res, next) {
    error.statusCode = error.statusCode || 500;
    error.status = error.status || `Source: Global Error Handling Middleware: ${error.status >= 400 && error.statusCode < 500 ? "Client Error" : "Internal Server Error"}`;

    return res.status(error.statusCode).json({
        status: error.status,
        message: error.message
    });
};

module.exports = globalErrorHandlingMiddleware;