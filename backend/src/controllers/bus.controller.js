const Bus = require("../models/Bus.js");

// Create Bus
exports.createBus = async (req, res) => {
  try {
    const { busNumber, capacity, route } = req.body;
    const bus = await Bus.create({ busNumber, capacity, route });
    res.status(201).json(bus);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all buses
exports.getBuses = async (req, res) => {
  try {
    const buses = await Bus.find().populate("route driver");
    res.json(buses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single bus
exports.getBusById = async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.id).populate("route driver");
    if (!bus) return res.status(404).json({ message: "Bus not found" });
    res.json(bus);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update bus
exports.updateBus = async (req, res) => {
  try {
    const bus = await Bus.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!bus) return res.status(404).json({ message: "Bus not found" });
    res.json(bus);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete bus
exports.deleteBus = async (req, res) => {
  try {
    const bus = await Bus.findByIdAndDelete(req.params.id);
    if (!bus) return res.status(404).json({ message: "Bus not found" });
    res.json({ message: "Bus deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
