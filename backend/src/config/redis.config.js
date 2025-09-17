const { createClient } = require("redis");
const { REDIS_URI } = require("./env.config");

let redisClient = null;

if (REDIS_URI) {
  redisClient = createClient({ url: REDIS_URI });

  redisClient.on("error", (err) => console.log("Redis Client Error", err));
  redisClient.on("connect", () => console.log("✅ Redis connected"));

  redisClient.connect().catch((err) => {
    console.log("⚠️ Redis connection failed:", err.message);
  });
}

module.exports = redisClient;
