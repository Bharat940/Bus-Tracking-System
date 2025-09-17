const express = require("express");
const router = express.Router();
const routeController = require("../controllers/route.controller.js");

router.post("/", routeController.createRoute);
router.get("/", routeController.getRoutes);

module.exports = router;
