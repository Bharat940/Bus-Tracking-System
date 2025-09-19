const trackingService = require("../services/tracking.service.js");
const { successResponse, errorResponse } = require("../utils/response.util.js");
const { calculateETA } = require("../utils/eta.util.js");

exports.updateLocation = async (req, res) => {
  try {
    const { busId, coords } = req.body;
    const location = await trackingService.updateBusLocation(busId, coords);
    return successResponse(res, location, "Location updated successfully");
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

exports.getETA = async (req, res) => {
  try {
    const { busId, stopId } = req.params;
    const eta = await calculateETA(busId, stopId);
    return successResponse(res, { eta }, "ETA calculated successfully");
  } catch (err) {
    return errorResponse(res, err.message);
  }
};
