import { createServer } from "http";
import "dotenv/config";

import { ObjectId } from "bson";
import { Session } from "express-session";
import db from "./databases/database";
import redisClient from "./utilities/redis";

import app from "./app";
import initializeSocket from "./socket";

//kan sebelumnyo lah ado nge set typing session, tapi untuk express bae 
//sekarang kito langsung set typing dari module http langsung, jadi biso utk socket dan express
//https://socket.io/how-to/use-with-express-session#with-typescript
declare module "http" {
  interface IncomingMessage {
    session: Session & {
      userId: ObjectId;
    };
  }
}

const port = process.env.PORT || "3000";

const server = createServer(app);

initializeSocket(server);

db.connectToDatabase()
  .then(() => {
    console.log("Connected To Database");

    redisClient
      .connect()
      .then(() => {
        console.log("Connected To Redis");

        server.listen(port, () => {
          console.log("Server Running On Port " + port);
        });
      })
      .catch((err: unknown) => {
        console.log(err);
      });
  })
  .catch((err: unknown) => {
    console.log(err);
  });
