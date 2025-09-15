const express = require("express");
const cors = require("cors");

// Import routes
// const authRoutes = require("./routes/auth.routes"); // example
// const busRoutes = require("./routes/bus.routes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => res.send("Backend API is running 🚀"));

// Uncomment and use your actual routes
// app.use("/api/auth", authRoutes);
// app.use("/api/buses", busRoutes);

module.exports = app;
