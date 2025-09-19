const { createClient } = require("redis");
const { REDIS_URI } = require("./env.config.js");

const redisClient = createClient({ url: REDIS_URI });

redisClient.on("error", (err) => console.error("❌ Redis error:", err));
redisClient.on("connect", () => console.log("✅ Redis connected"));

redisClient.connect().catch(() => console.error("⚠️ Redis connection failed"));

module.exports = redisClient;
