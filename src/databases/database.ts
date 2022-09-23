import mongoose from "mongoose";

let mongodbUrl: string = process.env.DB_CONNECT || "mongodb://localhost:27017/studgage";

async function connectToDatabase() {
  mongoose.connect(
    mongodbUrl,
    (err: unknown) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Database connected");
      }
    }
  );
};

export default {
  connectToDatabase
};
