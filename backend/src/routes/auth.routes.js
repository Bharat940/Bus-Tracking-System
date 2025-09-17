const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller.js");
const authController = require("../controllers/auth.controller.js");

// Register new user
router.post("/register", userController.register);

// Login
router.post("/login", authController.login);

// Get profile (only if logged in)
router.get("/me", authController.verifyToken, authController.getProfile);

module.exports = router;
