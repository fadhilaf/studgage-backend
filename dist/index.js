"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
require("dotenv/config");
const body_parser_1 = __importDefault(require("body-parser"));
const database_1 = __importDefault(require("./databases/database"));
const session_1 = __importDefault(require("./databases/session"));
const redis_1 = __importDefault(require("./utilities/redis"));
const sessionRead_1 = __importDefault(require("./middlewares/sessionRead"));
const auth_router_1 = __importDefault(require("./routers/auth.router"));
const app = (0, express_1.default)();
let server = (0, http_1.createServer)(app);
app.set("trust proxy", 1);
app.use((0, cors_1.default)({
    credentials: true,
    origin: process.env.FRONTEND_APP_URL || "http://localhost:5173",
}));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true, limit: "100mb" }));
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET,
    proxy: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        secure: process.env.NODE_ENV === "production", // must be true if sameSite='none'
    },
    store: session_1.default,
    resave: true,
    saveUninitialized: false,
}));
app.use(sessionRead_1.default);
const sessionCheckMiddleware = (req, res, next) => {
    console.log(req.student);
    next();
};
app.use(sessionCheckMiddleware);
app.use("/auth", auth_router_1.default);
const io = new socket_io_1.Server(server);
io.on("connection", (socket) => {
    console.log("User " + socket.id + " Connected");
    //neh ckmn ngambek data user nih
    //kykny harus pake middleware, gud gud
    redis_1.default.set("user", socket.id);
});
const port = process.env.PORT || "5000";
database_1.default.connectToDatabase()
    .then(() => {
    console.log("Connected To Database");
    server.listen(port, () => {
        console.log("Server Running On Port " + port);
    });
})
    .catch((err) => {
    console.log(err);
});
