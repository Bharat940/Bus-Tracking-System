const mongoose = require("mongoose");

const RouteSchema = new mongoose.Schema({
  name: { type: String, required: true },
  stops: [{ type: mongoose.Schema.Types.ObjectId, ref: "Stop" }],
  polyline: { type: String }, // optional encoded polyline or geojson
  distanceKm: { type: Number },
  schedule: [
    {
      tripStartTime: String, // "08:30"
      frequencyMinutes: Number,
    },
  ],
  city: { type: String },
  active: { type: Boolean, default: true },
});

module.exports = mongoose.model("Route", RouteSchema);
