const busService = require("../services/bus.service.js");
const { successResponse, errorResponse } = require("../utils/response.util.js");

// Create Bus
exports.createBus = async (req, res) => {
  try {
    const bus = await busService.createBus(req.body);
    return successResponse(res, bus, "Bus created successfully");
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

// Get all buses
exports.getBuses = async (req, res) => {
  try {
    const buses = await busService.findAllBuses();
    return successResponse(res, buses, "Buses retrieved successfully");
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

// Get single bus
exports.getBusById = async (req, res) => {
  try {
    const bus = await busService.findById(req.params.id);
    if (!bus) {
      return errorResponse(res, "Bus not found", 404);
    }
    return successResponse(res, bus, "Bus retrieved successfully");
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

// Update bus
exports.updateBus = async (req, res) => {
  try {
    const bus = await busService.updateBus(req.params.id, req.body);
    if (!bus) {
      return errorResponse(res, "Bus not found", 404);
    }
    return successResponse(res, bus, "Bus updated successfully");
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

// Delete bus
exports.deleteBus = async (req, res) => {
  try {
    const bus = await busService.removeBus(req.params.id);
    if (!bus) {
      return errorResponse(res, "Bus not found", 404);
    }
    return successResponse(res, bus, "Bus deleted successfully");
  } catch (err) {
    return errorResponse(res, err.message);
  }
};
