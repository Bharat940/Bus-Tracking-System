const Trip = require("../models/Trip.js");

exports.createTrip = async (req, res) => {
  try {
    const trip = await Trip.create(req.body);
    res.status(201).json(trip);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getTrips = async (req, res) => {
  try {
    const trips = await Trip.find().populate("bus route positions.stop");
    res.json(trips);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
