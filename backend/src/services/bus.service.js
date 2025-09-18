const Bus = require("../models/Bus.js");

exports.createBus = async (busData) => {
  try {
    return await Bus.create(busData);
  } catch (err) {
    console.error("❌ Create bus error:", err.message);
    return null;
  }
};

exports.findAllBuses = async () => {
  try {
    return await Bus.find().populate("route driver");
  } catch (err) {
    console.error("❌ Find all buses error:", err.message);
    return [];
  }
};

exports.findById = async (busId) => {
  try {
    return await Bus.findById(busId).populate("route driver");
  } catch (err) {
    console.error("❌ Find bus by ID error:", err.message);
    return null;
  }
};

exports.updateBus = async (busId, updateData) => {
  try {
    return await Bus.findByIdAndUpdate(busId, updateData, {
      new: true,
    }).populate("route driver");
  } catch (err) {
    console.error("❌ Update bus error:", err.message);
    return null;
  }
};

exports.removeBus = async (busId) => {
  try {
    return await Bus.findByIdAndDelete(busId);
  } catch (err) {
    console.error("❌ Remove bus error:", err.message);
    return null;
  }
};
