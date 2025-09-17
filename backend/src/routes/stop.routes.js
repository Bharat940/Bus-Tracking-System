const express = require("express");
const router = express.Router();
const stopController = require("../controllers/stop.controller.js");

router.post("/", stopController.createStop);
router.get("/", stopController.getStops);

module.exports = router;
