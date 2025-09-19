const express = require("express");
const router = express.Router();
const busController = require("../controllers/bus.controller.js");
const authMiddleware = require("../middleware/auth.middleware.js");

// Create bus (Admin only)
router.post("/", authMiddleware.isAdmin, busController.createBus);

// Get all buses
router.get("/", busController.getBuses);

// Get bus by ID
router.get("/:id", busController.getBusById);

// Update bus (Admin only)
router.put("/:id", authMiddleware.isAdmin, busController.updateBus);

// Delete bus (Admin only)
router.delete("/:id", authMiddleware.isAdmin, busController.deleteBus);

module.exports = router;
