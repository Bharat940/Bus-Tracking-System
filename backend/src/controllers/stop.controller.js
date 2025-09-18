const Stop = require("../models/Stop.js");
const { successResponse, errorResponse } = require("../utils/response.util.js");

exports.createStop = async (req, res) => {
  try {
    const stop = await Stop.create(req.body);
    return successResponse(res, stop, "Stop created successfully");
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

exports.getStops = async (req, res) => {
  try {
    const stops = await Stop.find();
    return successResponse(res, stops, "Stops retrieved successfully");
  } catch (err) {
    return errorResponse(res, err.message);
  }
};
