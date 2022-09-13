import express from "express";
import session from "express-session";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import "dotenv/config";
import bodyParser from "body-parser";

import { ObjectId } from "bson";
import db from "./databases/database";
import sessionStore from "./databases/session";
import redisClient from "./utilities/redis";

import sessionReadMiddleware from "./middlewares/sessionRead";
import errorHandler from "./middlewares/errorHandler";

import AuthRouter from "./routers/auth.router";

declare module "express-session" {
  interface SessionData {
    userId: ObjectId;
  }
}

interface ClientToServerEvents {
  hello: () => void;
}
interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
}
interface InterServerEvents {
  ping: () => void;
}
interface SocketData {
  name: string;
  age: number;
}

const app = express();

let server = createServer(app);

app.set("trust proxy", 1);

app.use(
  cors({
    credentials: true,
    origin: process.env.FRONTEND_APP_URL || "http://localhost:5173",
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true, limit: "100mb" }));

app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    proxy: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // must be 'none' to enable cross-site delivery
      secure: process.env.NODE_ENV === "production", // must be true if sameSite='none'
    },
    store: sessionStore,
    resave: true,
    saveUninitialized: false,
  })
);

app.use(sessionReadMiddleware);

const sessionCheckMiddleware: express.RequestHandler = (req, res, next) => {
  console.log(req.student);
  next();
};
app.use(sessionCheckMiddleware);

app.use("/auth", AuthRouter);

app.use(errorHandler);

const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>(server);

io.on("connection", (socket) => {
  console.log("User " + socket.id + " Connected")
  //neh ckmn ngambek data user nih
  //kykny harus pake middleware, gud gud
  redisClient.set("user", socket.id);
});

const port = process.env.PORT || "3000";

db.connectToDatabase()
  .then(() => {
    console.log("Connected To Database");

    server.listen(port, () => {
      console.log("Server Running On Port " + port);
    });
  })
  .catch((err: unknown) => {
    console.log(err);
  });
