const express = require("express");
const authControllers = require("../controllers/auth.controller");
const customerControllers = require("../controllers/customer.controller");

const router = express.Router();

// Middleware
router.use(authControllers.isAuthenticated);

// Routes
router.get("/all", customerControllers.getAllCustomers);
router.get("/:id", customerControllers.getCustomerById);
router.patch("/:id", customerControllers.updateCustomer);
router.delete("/:id", customerControllers.deleteCustomer);


module.exports = router;