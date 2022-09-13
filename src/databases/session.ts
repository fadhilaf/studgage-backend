import session from "express-session";
import MongoDBSessionStore from "connect-mongodb-session";

const SessionStore = MongoDBSessionStore(session);

let mongodbUrl: string = process.env.DB_CONNECT || process.env.DEV_DB_CONNECT!;

export default new SessionStore({ uri: mongodbUrl, collection: "session" });
