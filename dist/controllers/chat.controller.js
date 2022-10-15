"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = require("jsonwebtoken");
const getWebsocketToken = (req, res, next) => {
    const token = (0, jsonwebtoken_1.sign)({ id: req.user.id.toString() }, process.env.TOKEN_KEY, {
        expiresIn: "12h",
    });
    return res.json({ token });
};
exports.default = {
    getWebsocketToken,
};
