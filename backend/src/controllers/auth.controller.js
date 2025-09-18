const { signToken } = require("../utils/jwt.util.js");
const userService = require("../services/user.service.js");
const { successResponse, errorResponse } = require("../utils/response.util.js");

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await userService.findByEmail(email);
    if (existingUser) {
      return errorResponse(res, "User already exists", 400);
    }

    const user = await userService.createUser({ name, email, password, role });
    return successResponse(res, user, "User registered successfully");
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userService.findByEmail(email);

    if (!user) {
      return errorResponse(res, "Invalid email or password", 401);
    }

    const isPasswordValid = await userService.comparePassword(
      password,
      user.password
    );
    if (!isPasswordValid) {
      return errorResponse(res, "Invalid email or password", 401);
    }

    const token = signToken({ id: user._id, role: user.role });
    return successResponse(res, { token, user }, "Login successful");
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await userService.findUserById(req.user.id);
    if (!user) {
      return errorResponse(res, "User not found", 404);
    }
    return successResponse(res, user, "User profile retrieved successfully");
  } catch (err) {
    return errorResponse(res, err.message);
  }
};
