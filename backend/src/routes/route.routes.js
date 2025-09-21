const express = require("express");
const router = express.Router();
const routeController = require("../controllers/route.controller.js");
const authMiddleware = require("../middleware/auth.middleware.js");

router.post(
  "/",
  authMiddleware.verifyToken,
  authMiddleware.isAdmin,
  routeController.createRoute
);

router.get(
  "/",
  authMiddleware.verifyToken,
  authMiddleware.isAdmin,
  routeController.getRoutes
);

router.get(
  "/:id",
  authMiddleware.verifyToken,
  authMiddleware.isAdmin,
  routeController.getRouteById
);

module.exports = router;
