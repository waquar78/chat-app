import { Server } from "socket.io";
import User from "../models/user.js";

let io;
const onlineUsers = new Map(); // socketId : userId

export const setupSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // User join hone par usko online mark karo
    socket.on("user_online", async (userId) => {
      onlineUsers.set(socket.id, userId);
      await User.findByIdAndUpdate(userId, { isOnline: true, lastSeen: new Date() });

      // Notify sabko ke user online hai
      io.emit("update_user_status", { userId, isOnline: true });
    });

    // Typing status bhejna
    socket.on("typing", ({ chatId, senderName }) => {
      socket.to(chatId).emit("typing", { chatId, senderName });
    });

    // Stop typing
    socket.on("stop_typing", ({ chatId, senderName }) => {
      socket.to(chatId).emit("stop_typing", { chatId, senderName });
    });

    // Chat join
    socket.on("join_chat", (chatId) => {
      console.log(`${socket.id} joined chat: ${chatId}`);
      socket.join(chatId);
    });

    // Disconnect hone par user offline mark karo
    socket.on("disconnect", async () => {
      const userId = onlineUsers.get(socket.id);
      if (userId) {
        await User.findByIdAndUpdate(userId, { isOnline: false, lastSeen: new Date() });
        io.emit("update_user_status", { userId, isOnline: false });
        onlineUsers.delete(socket.id);
      }
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });
};

export const getSocketInstance = () => {
  if (!io) {
    throw new Error("Socket.io not initialized yet!");
  }
  return io;
};
