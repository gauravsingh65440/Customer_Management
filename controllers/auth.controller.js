const UserModel = require("../models/user.model");
const asyncHandler = require("../utils/asyncHandler");
const CustomError = require("../utils/CustomError");
const bcrypt = require("bcrypt");
const JWT = require("../utils/JWT");
const environmentVariables = require("../constants/environmentVariables");

// REGISTER new user
module.exports.register = asyncHandler(async (req, res, next) => {
	const { name, email, password, phone, address } = req.body;
	console.log(req.body);

	if (!name || !email || !password) {
		throw new CustomError("Some required fields are missing!", 400);
	}

	// Check: If account already exists.
	const user = await UserModel.findOne({ where: { email } });
	if (user) {
		throw new CustomError("Account already exists, Login instead!", 400);
	}

	// If account doesn't exists - register this user.
	const hashedPassword = await bcrypt.hash(password, 12); // password hashing
	const newUser = await UserModel.create({
		name,
		email,
		password: hashedPassword,
		phone,
		address,
	});

	return res.status(201).json({
		status: "success",
		message: "User registered successfully!",
		user: newUser,
	});
});

// LOGIN
module.exports.login = asyncHandler(async (req, res, next) => {
	const { email, password } = req.body;
	if (!email || !password) {
		throw new CustomError(
			"Some required fields are missing, both email and password is required!",
			400
		);
	}

	// Check: if account exists or not.
	const user = await UserModel.findOne({ where: { email } });
	if (!user) {
		throw new CustomError("Account doesn't exists, Signup instead!", 400);
	}

	// Check: whether user enters the correct password or not.
	const isMatched = await bcrypt.compare(password, user.password);
	if (!isMatched) {
		throw new CustomError("Incorrect Password!", 400);
	}

	// Sign JWT Token
	const token = JWT.generateJwtToken({ userId: user.id });

	return res
		.status(200)
		.cookie("jwt", token, {
			maxAge: 7 * 24 * 60 * 60 * 1000,
			httpOnly: true,
			sameSite: "strict",
			secure: environmentVariables.NODE_ENV !== "development",
		})
		.json({
			status: "success",
			message: "Logged In Sucessfully!",
			user: user,
			token: token,
		});
});

// LOGOUT
module.exports.logout = asyncHandler(async (req, res, next) => {
	// we just have to delete the cookie from the client side.
	return res
		.status(200)
		.cookie("jwt", "", {
			maxAge: 0,
		})
		.json({
			status: "success",
			message: "Logged out successfully!",
		});
});

// ISAUTHENTICATED - used to verify JWT token - to check whether user is authenticated or not.
module.exports.isAuthenticated = asyncHandler(async (req, res, next) => {
	let token;

	if (req.cookies.jwt) {
		token = req.cookies.jwt;
	} else if (
		req.headers.authorization &&
		req.headers.authorization.startsWith("Bearer")
	) {
		token = req.headers.authorization.split(" ")[1];
	}

	if (!token) {
		throw new CustomError(
			"You are not logged in! Please log in to access the application.",
			401
		);
	}

	const decoded = JWT.verifyJwtToken(token);
	const user = await UserModel.findByPk(decoded.userId);

	if (!user) {
		throw new CustomError(
			"The user belonging to this token no longer exists. Log in instead!",
			401
		);
	}

	req.user = user;
	// console.log(user);
	next();
});
