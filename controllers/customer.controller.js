const UserModel = require("../models/user.model");
const asyncHandler = require("../utils/asyncHandler");
const CustomError = require("../utils/CustomError");
const environmentVariables = require("../constants/environmentVariables");
const bcrypt = require("bcrypt");

// GET ME - Get logged in customer/user details.
module.exports.getMe = asyncHandler(async (req, res, next) => {
	const { user } = req;
	return res.status(200).json({
		status: "success",
		message: "Customer info. found successfully!",
		customer: user,
	});
});

// GET ALL CUSTOMERS
module.exports.getAllCustomers = asyncHandler(async (req, res, next) => {
	// Page-Based Pagination
	const page = parseInt(req.query.page) || 1;
	const limit = parseInt(req.query.limit) || 10; // 10 records per page (page 1: 1-10, page 2: 11 - 20, and ...)

	// Offset - Number of records to skip.
	const offset = (page - 1) * limit;

	// Total Records in User Table.
	const totalRecords = await UserModel.count();

	const customers = await UserModel.findAll({
		offset,
		limit,
	});

	return res.status(200).json({
		status: "success",
		message: "Customer(s) details fetched successfully!",
		customers: customers,

		/* Pagination Metadata  */
		pagination: {
			totalRecords,
			currentPage: page,
			limit,
			offset,
		},
	});
});

// GET CUSTOMER BY ID
module.exports.getCustomerById = asyncHandler(async (req, res, next) => {
	const id = req.params.id;
	const customer = await UserModel.findByPk(id);
	if (!customer) {
		throw new CustomError("Customer not found!", 404);
	}

	return res.status(200).json({
		status: "success",
		message: "Customer found successfully!",
		customer: customer,
	});
});

// UPDATE LOGGED IN CUSTOMER DETAILS (name, phone, address). We don't allow user to update thier email and, a separate route is created for updating password.
module.exports.updateCustomer = asyncHandler(async (req, res, next) => {
	const { user } = req;
	const id = user.id;
	const customer = await UserModel.findByPk(id);
	if (!customer) {
		throw new CustomError("Customer not found!", 404);
	}

	const { name, phone, address } = req.body;
	const updatedCustomer = await customer.update({
		name,
		phone,
		address,
	});

	return res.status(200).json({
		status: "success",
		message: "Customer details updated successfully!",
		customer: updatedCustomer,
	});
});

// // UPDATE CUSTOMER DETAILS (name, phone, address). We don't allow user to update thier email and, a separate route is created for updating password.
// module.exports.updateCustomerById = asyncHandler(async (req, res, next) => {
// 	const id = req.params.id;
// 	const customer = await UserModel.findByPk(id);
// 	if (!customer) {
// 		throw new CustomError("Customer not found!", 404);
// 	}

// 	const { name, phone, address } = req.body;
// 	const updatedCustomer = await customer.update({
// 		name,
// 		phone,
// 		address,
// 	});

// 	return res.status(200).json({
// 		status: "success",
// 		message: "Customer details updated successfully!",
// 		customer: updatedCustomer,
// 	});
// });

// UPDATE LOGGED IN CUSTOMER PASSWORD
module.exports.updatePassword = asyncHandler(async (req, res, next) => {
	const { id } = req?.user;
	const user = await UserModel.findByPk(id);

	const { currentPassword, newPassword } = req.body;

	if (!currentPassword || !newPassword) {
		throw new CustomError(
			"Both current password and new password is required!",
			400
		);
	}

	// if(currentPassword === newPassword){
	//     throw new CustomError("New password cannot be same as the new password!", 400);
	// }

	if (!(await user.comparePassword(currentPassword))) {
		throw new CustomError("Incorrect current password!", 400);
	}

	user.password =
		newPassword; /* will be hashed by beforeUpdate hook */
	user.passwordChangedAt = Date.now();

	await user.save(); // save the changes
	return res.status(200).json({
		status: "success",
		message: "Password updated successfully!",
	});
});

// DELETE LOGGED IN CUSTOMER
module.exports.deleteCustomer = asyncHandler(async (req, res, next) => {
	// const id = req.params.id;
	const { user } = req;
	const id = user.id;
	const customer = await UserModel.findByPk(id);

	if (!customer) {
		throw new CustomError("Customer not found!", 404);
	}

	await customer.destroy();
	return res.status(200).json({
		status: "success",
		message: "Customer deleted successfully!",
	});
});
