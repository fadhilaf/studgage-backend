"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authorizationMiddleware = (req, res, next) => {
    if (req.user) {
        return next();
    }
    return next(new Error("you are not authenticated"));
};
exports.default = authorizationMiddleware;
