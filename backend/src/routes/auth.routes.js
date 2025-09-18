const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller.js");
const authMiddleware = require("../middleware/auth.middleware.js");

// Register new user
router.post("/register", authController.register);

// Login
router.post("/login", authController.login);

// Get profile (only if logged in)
router.get("/me", authMiddleware.verifyToken, authController.getProfile);

module.exports = router;
