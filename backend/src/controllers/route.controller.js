const Route = require("../models/Route.js");

exports.createRoute = async (req, res) => {
  try {
    const route = await Route.create(req.body);
    res.status(201).json(route);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getRoutes = async (req, res) => {
  try {
    const routes = await Route.find().populate("stops");
    res.json(routes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
