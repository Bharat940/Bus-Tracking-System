const express = require("express");
const router = express.Router();
const tripController = require("../controllers/trip.controller.js");

router.post("/", tripController.createTrip);
router.get("/", tripController.getTrips);

module.exports = router;
