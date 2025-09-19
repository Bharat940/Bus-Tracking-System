const mongoose = require("mongoose");

const positionSchema = new mongoose.Schema({
  type: { type: String, enum: ["Point"], default: "Point" },
  coordinates: { type: [Number] },
  speed: Number,
  heading: Number,
  timestamp: { type: Date, default: Date.now },
});

const tripSchema = new mongoose.Schema({
  bus: { type: mongoose.Schema.Types.ObjectId, ref: "Bus", required: true },
  route: { type: mongoose.Schema.Types.ObjectId, ref: "Route", required: true },
  startTime: Date,
  endTime: Date,
  status: {
    type: String,
    enum: ["scheduled", "ongoing", "completed"],
    default: "scheduled",
  },
  positions: [positionSchema],
  estimatedArrivalTimes: [
    { stop: { type: mongoose.Schema.Types.ObjectId, ref: "Stop" }, eta: Date },
  ],
  delayMinutes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

tripSchema.index({ "positions.coordinates": "2dsphere" });

module.exports = mongoose.model("Trip", tripSchema);
