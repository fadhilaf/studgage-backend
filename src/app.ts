import express  from "express";
import cors from "cors";
import bodyParser from "body-parser";
import session from "express-session";

import sessionStore from "./databases/session";

import sessionReadMiddleware from "./middlewares/sessionRead";
import errorHandler from "./middlewares/errorHandler";

import AuthRouter from "./routers/auth.router";

const app = express();

app.set("trust proxy", 1);

app.use(
  cors({
    credentials: true,
    origin: process.env.FRONTEND_APP_URL || "http://localhost:5173",
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true, limit: "100mb" }));

app.use(session({
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
}));


app.use(sessionReadMiddleware);

const sessionCheckMiddleware: express.RequestHandler = (req, res, next) => {
  console.log(req.student);
  next();
};
app.use(sessionCheckMiddleware);

app.use("/auth", AuthRouter);

app.use(errorHandler);

export default app;
