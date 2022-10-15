"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
require("dotenv/config");
const database_1 = __importDefault(require("./databases/database"));
const redis_1 = __importDefault(require("./utilities/redis"));
const app_1 = __importDefault(require("./app"));
const socket_1 = __importDefault(require("./socket"));
const port = process.env.PORT || 3000;
const server = (0, http_1.createServer)(app_1.default);
(0, socket_1.default)(server);
database_1.default.connectToDatabase()
    .then(() => {
    console.log("Connected To Database");
    redis_1.default
        .connect()
        .then(() => {
        console.log("Connected To Redis");
        server.listen(port, process.env.NODE_ENV === "testing" ? "0.0.0.0" : "localhost", () => {
            console.log("Server Running On Port " + port);
        });
    })
        .catch((err) => {
        console.log(err);
    });
})
    .catch((err) => {
    console.log(err);
});
