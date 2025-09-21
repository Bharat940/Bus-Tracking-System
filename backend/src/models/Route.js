const mongoose = require("mongoose");

const RouteSchema = new mongoose.Schema({
  name: { type: String, required: true },
  stops: [{ type: mongoose.Schema.Types.ObjectId, ref: "Stop" }],
  polyline: {
    type: {
      type: String,
      enum: ["LineString"],
      default: "LineString",
      required: true,
    },
    coordinates: { type: [[Number]], required: true }, // [[lng, lat], ...]
  },
  distanceKm: { type: Number },
  schedule: [
    {
      tripStartTime: String, // "08:30"
      frequencyMinutes: Number,
    },
  ],
  city: { type: String },
  active: { type: Boolean, default: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

module.exports = mongoose.model("Route", RouteSchema);
