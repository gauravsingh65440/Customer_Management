function asyncHandler(asyncFunction) {
    return (req, res, next) => {
        Promise.resolve(asyncFunction(req, res, next)).catch((error) => next(error))
    };
};

module.exports = asyncHandler;