const http = require("http");
// const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { Server } = require("socket.io");
// const { createClient } = require("redis");
// const { createAdapter } = require("@socket.io/redis-adapter");

const app = require("./index");

// Load environment variables
dotenv.config();

// --- Database Connection ---
// mongoose
//   .connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("✅ MongoDB connected"))
//   .catch((err) => console.error("❌ MongoDB connection error:", err));

// --- HTTP Server ---
const server = http.createServer(app);

// --- Socket.IO + Redis Setup ---
// const io = new Server(server, {
//   cors: {
//     origin: "*", // replace with frontend URL in production
//     methods: ["GET", "POST"],
//   },
// });

// Redis adapter for Socket.IO scaling
// (async () => {
//   const pubClient = createClient({ url: process.env.REDIS_URI });
//   const subClient = pubClient.duplicate();

//   await Promise.all([pubClient.connect(), subClient.connect()]);
//   io.adapter(createAdapter(pubClient, subClient));

//   console.log("✅ Redis adapter connected");
// })();

// Socket.IO connection events
// io.on("connection", (socket) => {
//   console.log("⚡ User connected:", socket.id);

//   socket.on("disconnect", () => {
//     console.log("❌ User disconnected:", socket.id);
//   });
// });

// --- Start Server ---
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
