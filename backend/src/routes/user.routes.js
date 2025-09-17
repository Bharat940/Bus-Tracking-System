const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller.js");
const authMiddleware = require("../middlewares/auth.middleware.js");

// Admin can manage all users
router.get("/", authMiddleware.isAdmin, userController.getUsers);
router.get("/:id", authMiddleware.isAdmin, userController.getUserById);
router.put("/:id", authMiddleware.isAdmin, userController.updateUser);
router.delete("/:id", authMiddleware.isAdmin, userController.deleteUser);

module.exports = router;
