const bcrypt = require("bcryptjs");
const User = require("../models/User.js");

exports.findByEmail = async (email) => {
  try {
    return await User.findOne({ email });
  } catch (err) {
    console.error("❌ Find by email error:", err.message);
    return null;
  }
};

exports.createUser = async ({ name, email, password, role }) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    return await User.create({ name, email, password: hashedPassword, role });
  } catch (err) {
    console.error("❌ Create user error:", err.message);
    return null;
  }
};

exports.comparePassword = async (inputPassword, storedHash) => {
  try {
    return await bcrypt.compare(inputPassword, storedHash);
  } catch (err) {
    console.error("❌ Password comparison error:", err.message);
    return false;
  }
};

exports.findAllUsers = async () => {
  try {
    return await User.find()
      .select("-password")
      .populate("assignedBus preferences.favouriteRoutes");
  } catch (err) {
    console.error("❌ Find all users error:", err.message);
    return [];
  }
};

exports.findUserById = async (id) => {
  try {
    return await User.findById(id)
      .select("-password")
      .populate("assignedBus preferences.favouriteRoutes");
  } catch (err) {
    console.error("❌ Find user by ID error:", err.message);
    return null;
  }
};

exports.updateUserById = async (id, updateData) => {
  try {
    return await User.findByIdAndUpdate(id, updateData, { new: true })
      .select("-password")
      .populate("assignedBus preferences.favouriteRoutes");
  } catch (err) {
    console.error("❌ Update user error:", err.message);
    return null;
  }
};

exports.deleteUserById = async (id) => {
  try {
    return await User.findByIdAndDelete(id);
  } catch (err) {
    console.error("❌ Delete user error:", err.message);
    return null;
  }
};
