const mongoose = require("mongoose");

const RouteSchema = new mongoose.Schema({
  name: { type: String, required: true },
  stops: [{ type: mongoose.Schema.Types.ObjectId, ref: "Stop" }],
  polyline: String, // path A->B
  distanceKm: Number,
  schedule: [
    {
      tripStartTime: String, // e.g. "08:30"
      EndTime: String,
    },
  ],
  city: { type: String },
  active: { type: Boolean, default: true },
});

module.exports = mongoose.model("Route", RouteSchema);
