const Stop = require("../models/Stop.js");

exports.createStop = async (req, res) => {
  try {
    const stop = await Stop.create(req.body);
    res.status(201).json(stop);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getStops = async (req, res) => {
  try {
    const stops = await Stop.find();
    res.json(stops);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
