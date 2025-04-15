const UserModel = require("../models/user.model");
const asyncHandler = require("../utils/asyncHandler");
const CustomError = require("../utils/CustomError");
const environmentVariables = require("../constants/environmentVariables");

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
        limit
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
            offset
        },
    });
});

module.exports.getCustomerById = asyncHandler(async (req, res, next) => {
    const id = req.params.id;
    const customer = await UserModel.findByPk(id);
    if (!customer) {
        throw new CustomError("Customer not found!", 404);
    }

    return res.status(200).json({
        status: "success",
        message: "Customer found successfully!",
        customer: customer
    });
});

module.exports.updateCustomer = asyncHandler(async (req, res, next) => {
    const id = req.params.id;
    const customer = await UserModel.findByPk(id);
    if (!customer) {
        throw new CustomError("Customer not found!", 404);
    }

    const { name, phone, address } = req.body;
    const updatedCustomer = await customer.update({
        name,
        phone,
        address
    });

    return res.status(200).json({
        status: "success",
        message: "Customer details updated successfully!",
        customer: updatedCustomer
    });

});

module.exports.deleteCustomer = asyncHandler(async (req, res, next) => {
    const id = req.params.id;
    const customer = await UserModel.findByPk(id);

    if (!customer) {
        throw new CustomError("Customer not found!", 404);
    }

    await customer.destroy();
    return res.status(200).json({
        status: "success",
        message: "Customer deleted successfully!"
    });

})
