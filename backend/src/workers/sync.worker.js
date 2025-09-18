const redisClient = require("../config/redis.config");
const Bus = require("../models/Bus");

exports.syncBusLocations = async () => {
  const keys = await redisClient.keys("bus:*location");
  for (const key of keys) {
    const data = JSON.parse(await redisClient.get(key));
    const busId = key.split(":")[1];
    await Bus.findByIdAndUpdate(busId, {
      currentLocation: { type: "Point", coordinates: data.coords },
      lastUpdated: Date.now(),
    });
  }
};
