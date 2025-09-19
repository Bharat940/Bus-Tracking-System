const Bus = require("../models/Bus.js");

module.exports = (io, redisClient) => {
  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    // Driver sends location
    socket.on("location:update", async ({ busId, coords }) => {
      if (!busId || !coords) {
        return;
      }

      const locationKey = `bus:${busId}:location`;

      await redisClient.set(
        locationKey,
        JSON.stringify({ coords, ts: Date.now() })
      );

      io.to(`bus:${busId}`).emit("bus:location", { busId, coords });

      await Bus.findByIdAndUpdate(busId, {
        currentLocation: { type: "Point", coordinates: coords },
        lastUpdated: Date.now(),
      });
    });

    // Commuter subscribes
    socket.on("subscribe:bus", (busId) => {
      socket.join(`bus:${busId}`);
      console.log(`👥 User subscribed to bus ${busId}`);
    });

    socket.on("disconnect", () =>
      console.log("❌ Client disconnected:", socket.id)
    );
  });
};
