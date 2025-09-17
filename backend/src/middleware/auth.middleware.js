const jwt = require("jsonwebtoken");
const User = require("../models/User.js");

// ✅ Verify Token (login required)
exports.verifyToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(403).json({ message: "No token provided" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Unauthorized" });
    req.userId = decoded.id;
    next();
  });
};

// ✅ Check Admin Role
exports.isAdmin = async (req, res, next) => {
  try {
    if (!req.userId) return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.role !== "admin") {
      return res.status(403).json({ message: "Require Admin Role" });
    }

    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Check Driver Role
exports.isDriver = async (req, res, next) => {
  try {
    if (!req.userId) return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.role !== "driver") {
      return res.status(403).json({ message: "Require Driver Role" });
    }

    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Check Commuter Role
exports.isCommuter = async (req, res, next) => {
  try {
    if (!req.userId) return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.role !== "commuter") {
      return res.status(403).json({ message: "Require Commuter Role" });
    }

    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
