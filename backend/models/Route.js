const { model } = require("mongoose");
const { RouteSchema } = require("../Schemas/RouteSchema");

const RouteModel = new model("Route", RouteSchema);

module.exports = { RouteModel };
