import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import { ObjectId } from "bson";

import { JwtPayload, verify } from "jsonwebtoken";

import redisClient from "./utilities/redis";

import Student from "./models/student.model";

declare module "socket.io" {
  interface Socket {
    userId: ObjectId;
  }
}

interface ClientToServerEvents {}
interface ServerToClientEvents {}
interface InterServerEvents {}
interface SocketData {}

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
    console.log("A User Connected To Socket");
  });

  io.use((socket, next) => {
    const auth = socket.handshake.auth as { token: string };

    if (auth?.token) {
      //bagian ini biso jadi apus galo
      verify(auth!.token!, process.env.TOKEN_KEY!, function (err, decoded) {
        if (err) {
          console.log(err);
          next(new Error("you have the wrong token"));
        } else {
          socket.userId = decoded!.id!;

          console.log(decoded);
          next();
        }
      });
      //sampe sini apus
    } else {
      next(new Error("please provide token"));
    }
  });
}

export default initializeSocket;
