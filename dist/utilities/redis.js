"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
const redisUrl = `redis://localhost:6379`;
const redisClient = (0, redis_1.createClient)({
    url: redisUrl,
});
redisClient.on("error", (err) => console.log("Redis Client Error", err));
exports.default = redisClient;
