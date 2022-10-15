import mongoose from "mongoose";

let mongodbUrl: string =
  process.env.DB_CONNECT || "mongodb://localhost:27017/studgage";

async function connectToDatabase() {
  let response;
  try {
    response = await mongoose.connect(mongodbUrl);
  } catch (err: unknown) {
    throw err;
  }

  return response;
}
export default {
  connectToDatabase,
};
