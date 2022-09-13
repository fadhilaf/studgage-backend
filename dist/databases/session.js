"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_session_1 = __importDefault(require("express-session"));
const connect_mongodb_session_1 = __importDefault(require("connect-mongodb-session"));
const SessionStore = (0, connect_mongodb_session_1.default)(express_session_1.default);
let mongodbUrl = process.env.DB_CONNECT || process.env.DEV_DB_CONNECT;
exports.default = new SessionStore({ uri: mongodbUrl, collection: "session" });
