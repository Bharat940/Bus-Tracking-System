const { model } = require("mongoose");
const { StopSchema } = require("../Schemas/StopSchema");

// Create the model
const StopModel = model("stop", StopSchema);

module.exports = { StopModel };
