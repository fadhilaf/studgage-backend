import { Server } from "socket.io";
import { Server as HttpServer } from "http";

import { verify, VerifyErrors } from "jsonwebtoken";

import redisClient from "./utilities/redis";

declare module "socket.io" {
  interface Socket {
    userId?: string;
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

  io.use((socket, next) => {
    const auth = socket.handshake.auth as { token: string };

    if (auth?.token) {
      try {
        const user = verify(auth!.token!, process.env.TOKEN_KEY!) as {
          id: string;
          exp: number;
          iat: number;
        };
        socket.userId = user.id;
        return next();
      } catch (err) {
        return next(err as VerifyErrors);
      }
    } else {
      next(new Error("please provide token"));
    }
  });

  io.on("connection", (socket) => {
    redisClient.set(socket.userId!, socket.id).then(() => {
      console.log("User " + socket.userId + " Connected To Socket");
    });
    
    socket.on("disconnect", () => {
      redisClient.del(socket.userId!).then(() => {

        console.log("User " + socket.userId + " Disconnected To Socket");
        socket.userId = undefined;
      });
    });
  });
}

export default initializeSocket;
