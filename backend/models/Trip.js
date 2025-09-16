const { model } = require("mongoose");
const { TripSchema } = require("../Schemas/TripSchema");

const TripModel = model("trip", TripSchema);

module.exports = { TripModel };
