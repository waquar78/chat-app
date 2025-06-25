import express from "express";
import dotenv from "dotenv";
import dbConnection from "./utils/database.js";
import userRoutes from "./routes/userRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http"; // server banane ke liye
import { setupSocket } from "./socket/socket.js"; // socket setup import

dotenv.config();

const app = express();
const server = http.createServer(app); // Express server wrap in HTTP server

dbConnection();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));

const port = process.env.PORT;

// Routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/chat", chatRoutes);
app.use("/api/v1/message", messageRoutes);

// Socket setup
setupSocket(server);

// Server start
server.listen(port, () => {
  console.log(` App is listening at port ${port}`);
});
