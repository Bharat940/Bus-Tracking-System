const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["admin", "driver", "commuter"],
    default: "commuter",
  },
  assignedBus: { type: mongoose.Schema.Types.ObjectId, ref: "Bus" },
  preferences: {
    lowBandwidth: { type: Boolean, default: false },
    favouriteRoutes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Route" }],
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", UserSchema);
