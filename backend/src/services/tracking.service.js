const Bus = require("../models/Bus.js");

exports.updateBusLocation = async (busId, coords) => {
  try {
    return await Bus.findByIdAndUpdate(
      busId,
      {
        currentLocation: { type: "Point", coordinates: coords },
        lastUpdated: Date.now(),
      },
      { new: true }
    ).populate("route driver");
  } catch (err) {
    console.error("❌ Update bus location error:", err.message);
    return null;
  }
};
