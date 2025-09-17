require("dotenv").config();

module.exports = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI || "mongodb://localhost:27017/transport",
  REDIS_URI: process.env.REDIS_URI || "redis://localhost:6379",
  JWT_SECRET: process.env.JWT_SECRET || "supersecret",
};
