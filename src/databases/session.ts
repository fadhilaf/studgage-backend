import session from "express-session";
import MongoDBSessionStore from "connect-mongodb-session";

const SessionStore = MongoDBSessionStore(session);

let mongodbUrl: string = process.env.DB_CONNECT || "mongodb://localhost:27017/studgage";

export default new SessionStore({ uri: mongodbUrl, collection: "session" });
