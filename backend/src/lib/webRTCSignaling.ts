import { Server } from "socket.io";
import http from "http";
import express from "express";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const serverHttp = http.createServer(app);

const io = new Server(serverHttp, {
  cors: {
    origin: [process.env.FRONTEND_URL ?? "http://localhost:5173"],
  },
});

io.on("connection", (socket) => {
  if (!socket.handshake.query.userId) {
    console.error("User ID not provided in handshake query");
    return;
  }

  const userId: string = socket.handshake.query.userId as string;

  socket.join(userId);

  socket.on("offer", ({ offer, target, caller }) => {
    socket.to(target).emit("offer", { offer, caller });
  });

  socket.on("answer", ({ answer, target }) => {
    socket.to(target).emit("answer", answer);
  });

  socket.on("ice-candidate", ({ candidate, to }) => {
    socket.to(to).emit("ice-candidate", { candidate });
  });

  socket.on("decline-call", ({ target }) => {
    socket.to(target).emit("call-declined");
  });

  socket.on("end-call", ({ target }) => {
    socket.to(target).emit("call-ended");
  });
});

serverHttp.listen(process.env.WEBRTC_PORT ?? 3000, () => {
  console.log("[SIG] Listening on port 3000");
});
