const Joi = require("joi");

const signinSchema = Joi.object({
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
});

module.exports = { signinSchema };
