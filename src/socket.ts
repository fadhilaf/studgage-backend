import { Server } from "socket.io";
import { Server as HttpServer } from "http";

import {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData,
} from "./socketEvents/types";

import redisClient from "./utilities/redis";

import Student from "./models/student.model";

function initializeSocket(server: HttpServer) {
  const io = new Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >(server, {
    cors: { origin: process.env.FRONTEND_URL || "*" },
  });

  io.on("connection", (socket) => {
    console.log("User " + socket.id + " Connected");
    //neh ckmn ngambek data user nih
    //kykny harus pake middleware, gud gud
    redisClient.set("user", socket.id);
  });

  const privateChatIo = io.of("/private");

  privateChatIo.on("connection", (socket) => {
    console.log("User " + socket.id + " Connected to private chat namespace");
  });

  return io;
}

export default initializeSocket;
