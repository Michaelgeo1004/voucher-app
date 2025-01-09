const express = require("express");
const router = express.Router();
const authController = require('../controllers/auth.controller')

//Login
router.get("/", (req, res) => {
  res.redirect("/login");
});

router.get("/login", (req, res) => {
  res.render("login");
});

// Handle login form submission
router.post("/login",authController.login)

// Logout page
router.get("/logout",authController.logout);

module.exports = router;
