import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const serverHttp = http.createServer(app);

const io = new Server(serverHttp, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

const userSocketMap = new Map<string, string>(); // <userId, socketId>

export function getReceiverSocketId(userId: string): string | undefined {
  return userSocketMap.get(userId);
}

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);
  if (!socket.handshake.query.userId) {
    console.error("User ID not provided in handshake query");
    return;
  }
  const userId: string = socket.handshake.query.userId as string;
  if (userId) userSocketMap.set(userId, socket.id);

  io.emit("getOnlineUsers", Array.from(userSocketMap.keys()));

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
    userSocketMap.delete(userId);
    io.emit("getOnlineUsers", Array.from(Object.keys(userSocketMap)));
  });
});

export { io, app, serverHttp };
