const Joi = require("joi");

const registerSchema = Joi.object({
	name: Joi.string().required(),
	email: Joi.string()
		.pattern(
			new RegExp(
				"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
			) /* Custom email regex */
		)
		.required() /* all fields are optional by default, we have to mark fields as required. */,
	password: Joi.string()
		.pattern(new RegExp("^[a-zA-Z0-9@]{3,30}$"))
		.min(6)
		.max(20)
		.required(),
	phone: Joi.string()
		.length(10)
		.pattern(/^[6-9]{1}[0-9]{9}$/)
		.optional(),
	address: Joi.string().optional(),
});

module.exports = { registerSchema };
