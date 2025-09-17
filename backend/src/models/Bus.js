const mongoose = require("mongoose");

const BusSchema = new mongoose.Schema({
  busNumber: { type: String, required: true },
  capacity: { type: Number, required: true },
  currentLocation: {
    coordinates: { type: [Number], default: [0, 0] },
  },
  route: { type: mongoose.Schema.Types.ObjectId, ref: "Route" },
  driver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },
  lastUpdated: { type: Date, default: Date.now },
  occupancy: { type: Number, default: 0 },
});

module.exports = mongoose.model("Bus", BusSchema);
