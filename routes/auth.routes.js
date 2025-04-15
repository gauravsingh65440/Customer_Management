const express = require("express");
const authControllers = require("../controllers/auth.controller");
const {
	validationMiddleware,
} = require("../middlewares/validation.middleware");
const { registerSchema } = require("../validations/signup.validation");
const { signinSchema } = require("../validations/signin.validation");

const router = express.Router();
router.post(
	"/signup",
	validationMiddleware(registerSchema),
	authControllers.register
);
router.post(
	"/login",
	validationMiddleware(signinSchema),
	authControllers.login
);

module.exports = router;
