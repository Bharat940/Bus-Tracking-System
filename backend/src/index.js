const express = require("express");
const cors = require("cors");

// Import routes
// const authRoutes = require("./routes/auth.routes"); // example
// const busRoutes = require("./routes/bus.routes");
// const routeRoutes = require("./routes/route.routes");
// const trackingRoutes = require("./routes/tracking.routes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => res.send("Backend API is running 🚀"));

// app.use("/api/auth", authRoutes);
// app.use("/api/buses", busRoutes);
// app.use("/api/routes", routeRoutes);
// app.use("/api/tracking", trackingRoutes);

module.exports = app;
