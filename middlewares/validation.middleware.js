const CustomError = require("../utils/CustomError");

function validationMiddleware(schema) {
	return async (req, res, next) => {
		try {
			await schema.validateAsync(req.body);
			next();
		} catch (error) {
			console.error("Validation Error: ", error.details);
			next(
				new CustomError(
					`Validation Error: ${error.details[0].message}`, // More readable error message
					400
				)
			);
		}
	};
}

module.exports = { validationMiddleware };
