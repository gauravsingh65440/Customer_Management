const express = require("express");
const authControllers = require("../controllers/auth.controller");
const customerControllers = require("../controllers/customer.controller");

const router = express.Router();

// Middleware
router.use(authControllers.isAuthenticated);

// Routes
router.get("/me", customerControllers.getMe);
router.get("/all", customerControllers.getAllCustomers);
router.get("/:id", customerControllers.getCustomerById);
router.patch("/me", customerControllers.updateCustomer);
router.patch("/password", customerControllers.updatePassword);
// router.patch("/:id", customerControllers.updateCustomerById);
// router.delete("/:id", customerControllers.deleteCustomer);
router.delete("/me", customerControllers.deleteCustomer);


module.exports = router;