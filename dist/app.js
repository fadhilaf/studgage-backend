"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const express_session_1 = __importDefault(require("express-session"));
const session_1 = __importDefault(require("./databases/session"));
const sessionRead_1 = __importDefault(require("./middlewares/sessionRead"));
const authorizationMiddleware_1 = __importDefault(require("./middlewares/authorizationMiddleware"));
const errorHandler_1 = __importDefault(require("./middlewares/errorHandler"));
const auth_router_1 = __importDefault(require("./routers/auth.router"));
const user_router_1 = __importDefault(require("./routers/user.router"));
const chat_router_1 = __importDefault(require("./routers/chat.router"));
const app = (0, express_1.default)();
app.set("trust proxy", 1);
app.use((0, cors_1.default)({
    credentials: true,
    origin: true,
    // origin: process.env.FRONTEND_APP_URL || ["http://localhost:5173", "http://192.168.100.85:5173"],
}));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true, limit: "100mb" }));
//kalo mau kirim cookies trus diterima di frontned,
//harus pake domain name yang sama. contohnya localhost
//kalo dak gitu (cuma pake ip bae) bakal di ignore oleh browser T-T
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET,
    proxy: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        secure: process.env.NODE_ENV === "production",
    },
    store: session_1.default,
    resave: true,
    saveUninitialized: false,
}));
app.use("/auth", auth_router_1.default);
app.use(sessionRead_1.default);
app.use(authorizationMiddleware_1.default);
app.use("/assets", express_1.default.static("./assets"));
app.use("/user", user_router_1.default);
app.use("/chat", chat_router_1.default);
app.use(errorHandler_1.default);
exports.default = app;
