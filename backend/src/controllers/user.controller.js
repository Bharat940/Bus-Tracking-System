const userService = require("../services/user.service.js");
const { successResponse, errorResponse } = require("../utils/response.util.js");

// ✅ Get all users (Admin only)
exports.getUsers = async (req, res) => {
  try {
    const users = await userService.findAllUsers();
    return successResponse(res, users, "Users retrieved successfully");
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

// ✅ Get user by ID (Admin only)
exports.getUserById = async (req, res) => {
  try {
    const user = await userService.findUserById(req.params.id);
    if (!user) {
      return errorResponse(res, "User not found", 404);
    }
    return successResponse(res, user, "User retrieved successfully");
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

// ✅ Update user (Admin only, e.g. role update, assign bus)
exports.updateUser = async (req, res) => {
  try {
    const updatedUser = await userService.updateUserById(
      req.params.id,
      req.body
    );
    if (!updatedUser) {
      return errorResponse(res, "User not found or update failed", 404);
    }
    return successResponse(res, updatedUser, "User updated successfully");
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

// ✅ Delete user (Admin only)
exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await userService.deleteUserById(req.params.id);
    if (!deletedUser) {
      return errorResponse(res, "User not found or delete failed", 404);
    }
    return successResponse(res, deletedUser, "User deleted successfully");
  } catch (err) {
    return errorResponse(res, err.message);
  }
};
