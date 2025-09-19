const Trip = require("../models/Trip.js");
const { successResponse, errorResponse } = require("../utils/response.util.js");

exports.createTrip = async (req, res) => {
  try {
    const trip = await Trip.create(req.body);
    return successResponse(res, trip, "Trip created successfully");
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

exports.getTrips = async (req, res) => {
  try {
    const trips = await Trip.find().populate("bus route positions.stop");
    return successResponse(res, trips, "Trips retrieved successfully");
  } catch (err) {
    return errorResponse(res, err.message);
  }
};
