import "dotenv/config";
import http from "http";
import App from "./app.js";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import roomModel from "./models/room.model.js";

const PORT = process.env.PORT || 3000;

const server = http.createServer(App);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.use(async (socket, next) => {
  try {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers.authorization?.split(" ")[1];
    const roomId = socket.handshake.query.roomId;
    
    console.log("Socket handshake query:", socket.handshake.query);
    console.log("Attempting to connect to room:", roomId);
    console.log("Token received:", token ? "Yes" : "No");

    // Check if roomId exists
    if (!roomId) {
      console.log("roomId is missing from query");
      return next(new Error("roomId is required"));
    }

    // Validate roomId format
    if (!mongoose.Types.ObjectId.isValid(roomId)) {
      console.log("Invalid roomId format:", roomId);
      return next(new Error("Invalid roomId format"));
    }

    // Find the room
    const room = await roomModel.findById(roomId);
    if (!room) {
      console.log("Room not found:", roomId);
      return next(new Error("Room not found"));
    }

    socket.room = room;

    // Check for token
    if (!token) {
      return next(new Error("Authentication error: No token provided"));
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return next(new Error("Authentication error: Invalid token"));
    }

    socket.user = decoded;

    console.log("User connected to room:", socket.room._id);
    console.log("User info:", socket.user);

    next();
  } catch (error) {
    console.error("Socket authentication error:", error.message);
    next(error);
  }
});

io.on("connection", (socket) => {
  console.log("A user connected to room:", socket.room._id);
  console.log("User info:", socket.user);
  
  // Join the room
  socket.join(socket.room._id.toString());

  socket.on("room-message", async (data) => {
    console.log("Message received:", data);
    // Broadcast to all users in the room except sender
    socket.broadcast.to(socket.room._id.toString()).emit("room-message", data);
  });

  socket.on("event", (data) => {
    console.log("Event received:", data);
    // Handle custom events
  });

  socket.on("disconnect", () => {
    console.log("User disconnected from room:", socket.room._id);
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});