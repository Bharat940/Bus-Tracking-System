const mongoose = require("mongoose");

const TripSchema = new mongoose.Schema({
  bus: { type: mongoose.Schema.Types.ObjectId, ref: "Bus", required: true },
  route: { type: mongoose.Schema.Types.ObjectId, ref: "Route", required: true },
  startTime: Date,
  endTime: Date,
  status: {
    type: String,
    enum: ["scheduled", "ongoing", "completed"],
    default: "scheduled",
  },
  positions: [
    {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: [Number],
      speed: Number,
      heading: Number,
      timestamp: { type: Date, default: Date.now },
    },
  ],
  estimatedArrivalTimes: [
    {
      stop: { type: mongoose.Schema.Types.ObjectId, ref: "Stop" },
      eta: Date,
    },
  ],
  delayMinutes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Trip", TripSchema);
