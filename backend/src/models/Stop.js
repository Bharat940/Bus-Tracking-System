const mongoose = require("mongoose");

const StopSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], required: true }, // [lng, lat]
  },
  sequence: { type: Number, default: 0 },
  city: { type: String },
});

StopSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Stop", StopSchema);
