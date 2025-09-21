const Route = require("../models/Route.js");
const { successResponse, errorResponse } = require("../utils/response.util.js");

// Create Route (assign owner automatically)
exports.createRoute = async (req, res) => {
  try {
    const routeData = { ...req.body, owner: req.user.id };
    const route = await Route.create(routeData);
    return successResponse(res, route, "Route created successfully");
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

// Get routes only for the logged-in admin
exports.getRoutes = async (req, res) => {
  try {
    const routes = await Route.find({ owner: req.user.id }).populate("stops");
    return successResponse(res, routes, "Routes retrieved successfully");
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

// Get single route with owner check
exports.getRouteById = async (req, res) => {
  try {
    const route = await Route.findById(req.params.id).populate("stops");
    if (!route) return errorResponse(res, "Route not found", 404);
    if (route.owner.toString() !== req.user.id)
      return errorResponse(res, "Unauthorized", 403);
    return successResponse(res, route, "Route retrieved successfully");
  } catch (err) {
    return errorResponse(res, err.message);
  }
};
