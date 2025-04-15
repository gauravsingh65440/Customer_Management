const express = require("express");
const authRoutes = require("./auth.routes");
const customerRoutes = require("./customer.routes");


const router = express.Router();

// Authentication Routes
router.use("/auth", authRoutes);

// Customer Routes
router.use("/customer", customerRoutes);

module.exports = router;