const express = require("express");
const cors = require("cors");
const errorHandler = require("./middleware/error.middleware.js");

// Import routes
const authRoutes = require("./routes/auth.routes.js");
const busRoutes = require("./routes/bus.routes.js");
const routeRoutes = require("./routes/route.routes.js");
const stopRoutes = require("./routes/stop.routes.js");
const tripRoutes = require("./routes/trip.routes.js");
const userRoutes = require("./routes/user.routes.js");
const trackingRoutes = require("./routes/tracking.routes.js");

const app = express();

// Middleware

app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use(express.json());

// Routes
app.get("/", (req, res) => res.send("Backend API is running 🚀"));

app.use("/api/auth", authRoutes);
app.use("/api/buses", busRoutes);
app.use("/api/routes", routeRoutes);
app.use("/api/stops", stopRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tracking", trackingRoutes);

// Error Handling Middleware
app.use(errorHandler);

module.exports = app;
