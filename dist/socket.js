"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const jsonwebtoken_1 = require("jsonwebtoken");
const student_model_1 = __importDefault(require("./models/student.model"));
const redis_1 = __importDefault(require("./utilities/redis"));
function initializeSocket(server) {
    const io = new socket_io_1.Server(server, {
        cors: { origin: process.env.FRONTEND_URL || "*" },
    });
    io.use((socket, next) => {
        console.log("something tries to connect");
        const auth = socket.handshake.auth;
        if (auth === null || auth === void 0 ? void 0 : auth.token) {
            try {
                const user = (0, jsonwebtoken_1.verify)(auth.token, process.env.TOKEN_KEY);
                //https://github.com/Automattic/mongoose/issues/10954#issuecomment-994882772
                student_model_1.default.findById(user.id, (err, student) => {
                    if (err)
                        return next(err);
                    socket.userId = user.id;
                    console.log("username: ", student.username);
                    return next();
                });
            }
            catch (err) {
                return next(err);
            }
        }
        else {
            next(new Error("please provide token"));
        }
    });
    io.on("connection", (socket) => {
        redis_1.default.set(socket.userId, socket.id).then(() => {
            console.log("User " + socket.userId + " Connected To Socket");
        });
        socket.on("private", (destination, msg) => __awaiter(this, void 0, void 0, function* () {
            redis_1.default.get(destination).then((res) => {
                if (res === null) {
                    io.to(socket.id).emit("error", "invalid user id");
                }
                else {
                    io.to(res).emit("private", socket.userId, msg);
                }
            });
        }));
        socket.on("ping", () => {
            io.to(socket.id).emit("pong");
        });
        socket.on("disconnect", () => {
            redis_1.default.del(socket.userId).then(() => {
                console.log("User " + socket.userId + " Disconnected To Socket");
                socket.userId = undefined;
            });
        });
    });
}
exports.default = initializeSocket;
