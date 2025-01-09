const express = require("express");
const router = express.Router();
const isAuthenticated = require("../middleware/auth.middleware");
const dashboardController = require('../controllers/dashboard.controller')

// Dashboard page (only accessible if authenticated)
router.get("/dashboard", isAuthenticated,dashboardController.getDashboard);

module.exports = router;
