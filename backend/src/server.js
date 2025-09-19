const http = require("http");
const { Server } = require("socket.io");
const { PORT } = require("./config/env.config.js");
const connectDB = require("./config/db.config.js");
const redisClient = require("./config/redis.config.js");
const socketHandlers = require("./sockets/socketHandler.js");

const app = require("./index");

connectDB();

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

server.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
