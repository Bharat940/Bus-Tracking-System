const Route = require("../models/Route.js");
const { successResponse, errorResponse } = require("../utils/response.util.js");

exports.createRoute = async (req, res) => {
  try {
    const route = await Route.create(req.body);
    return successResponse(res, route, "Route created successfully");
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

exports.getRoutes = async (req, res) => {
  try {
    const routes = await Route.find().populate("stops");
    return successResponse(res, routes, "Routes retrieved successfully");
  } catch (err) {
    return errorResponse(res, err.message);
  }
};
