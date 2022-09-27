import { Server } from "socket.io";
import { Server as HttpServer } from "http";

import { verify, VerifyErrors } from "jsonwebtoken";

import { CallbackError } from "mongoose";
import Student, { IStudent } from "./models/student.model";

import redisClient from "./utilities/redis";

declare module "socket.io" {
  interface Socket {
    userId?: string;
  }
}

interface ClientToServerEvents {
  private: (destination: string, message: string) => void;
  ping: () => void;
}
interface ServerToClientEvents {
  private: (sender: string, message: string) => void;
  pong: () => void;
  error: (error: string) => void;
}
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
    console.log("something tries to connect");

    const auth = socket.handshake.auth as { token: string };

    if (auth?.token) {
      try {
        const user = verify(auth!.token!, process.env.TOKEN_KEY!) as {
          id: string;
          exp: number;
          iat: number;
        };

        //https://github.com/Automattic/mongoose/issues/10954#issuecomment-994882772
        Student.findById(user.id, (err: CallbackError, student: IStudent) => {
          if (err) return next(err);

          socket.userId = user.id;
          console.log("username: ", student.username);
          return next();
        });
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

    socket.on("private", async (destination, msg) => {
      redisClient.get(destination).then((res)=>{
        if (res === null) {
          io.to(socket.id).emit("error", "invalid user id")
        } else {
          io.to(res).emit("private", socket.userId!, msg)
        }
      });
    });

    socket.on("ping", () => {
      io.to(socket.id).emit("pong");
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
