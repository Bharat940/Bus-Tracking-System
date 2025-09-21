const mongoose = require("mongoose");

const BusSchema = new mongoose.Schema(
  {
    busNumber: { type: String, required: true, unique: true },
    capacity: { type: Number, default: 0 },
    currentLocation: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], default: [0, 0] }, // [lng, lat]
    },
    route: { type: mongoose.Schema.Types.ObjectId, ref: "Route" },
    driver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: {
      type: String,
      enum: ["active", "inactive", "maintenance"],
      default: "active",
    },
    lastUpdated: { type: Date, default: Date.now },
    occupancy: { type: Number, default: 0 },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    metadata: { type: Map, of: String },
  },
  { timestamps: true }
);

BusSchema.index({ currentLocation: "2dsphere" });

module.exports = mongoose.model("Bus", BusSchema);
