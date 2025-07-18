import "dotenv/config";
import http from "http";
import app from "./app.js";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import roomModel from "./models/room.model.js";
import { generateResult } from "./services/ai.service.js";

const port = process.env.PORT || 3000;

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
});

io.use(async (socket, next) => {
  try {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers.authorization?.split(" ")[1];
    const roomId = socket.handshake.query.roomId;

    if (!mongoose.Types.ObjectId.isValid(roomId)) {
      return next(new Error("Invalid roomId"));
    }

    socket.room = await roomModel.findById(roomId);

    if (!token) {
      return next(new Error("Authentication error"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return next(new Error("Authentication error"));
    }

    socket.user = decoded;

    next();
  } catch (error) {
    next(error);
  }
});

io.on("connection", (socket) => {
  socket.rid = socket.room._id.toString();

  console.log("a user connected");

  socket.join(socket.rid);

  socket.on("room-message", async (data) => {
    const message = data.message;

    const aiIsPresentInMessage = message.includes("@aura");
    socket.broadcast.to(socket.rid).emit("room-message", data);

    if (aiIsPresentInMessage) {
      const prompt = message.replace("@aura", "");

      const result = await generateResult(prompt);

      io.to(socket.rid).emit("room-message", {
        message: result,
        sender: {
          _id: "auraAI",
          email: "AI",
        },
      });

      return;
    }
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
    socket.leave(socket.rid);
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
