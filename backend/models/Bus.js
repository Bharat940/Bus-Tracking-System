const { model } = require("mongoose");
const { BusSchema } = require("../Schemas/BusSchema");

const BusModel = new model("Bus", BusSchema);

module.exports = { BusModel };
