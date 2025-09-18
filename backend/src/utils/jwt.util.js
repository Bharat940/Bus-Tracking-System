const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/env.config.js");

exports.signToken = (payLoad, expiresIn = "7d") => {
  try {
    return jwt.sign(payLoad, JWT_SECRET, { expiresIn });
  } catch (err) {
    console.error("❌ JWT signing error:", err.message);
    return null;
  }
};

exports.verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    console.error("❌ JWT verification error:", err.message);
    return null;
  }
};
