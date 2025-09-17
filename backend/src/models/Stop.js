const mongoose = require("mongoose");

const StopSchema = new mongoose.Schema({
  name: String,
  location: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], required: true }, // [lng, lat]
  },
  sequence: Number, // order in route
  city: { type: String },
});

module.exports = mongoose.model("Stop", StopSchema);
