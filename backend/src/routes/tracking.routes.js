const express = require("express");
const router = express.Router();
const trackingController = require("../controllers/tracking.controller.js");

router.post("/update", trackingController.updateLocation); // driver updates location
router.get("/eta/:busId/:stopId", trackingController.getETA); // ETA for commuters

module.exports = router;
