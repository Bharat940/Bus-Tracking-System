const User = require("../models/User.js");
const { verifyToken } = require("../utils/jwt.util.js");

// Verify Token
exports.verifyToken = async (req, res, next) => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = verifyToken(token);
    req.userId = decoded?.id;

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: "Unauthorized" });
  }
};

// Check Admin Role
exports.isAdmin = async (req, res, next) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.role !== "admin") {
      return res.status(403).json({ message: "Require Admin Role" });
    }

    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Check Driver Role
exports.isDriver = async (req, res, next) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.role !== "driver") {
      return res.status(403).json({ message: "Require Driver Role" });
    }

    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Check Commuter Role
exports.isCommuter = async (req, res, next) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.role !== "commuter") {
      return res.status(403).json({ message: "Require Commuter Role" });
    }

    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
