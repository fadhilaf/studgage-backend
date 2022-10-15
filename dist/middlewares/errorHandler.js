"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandler = (err, req, res, next) => {
    console.log(err.message);
    //jangan lupo kasi kode http error
    return res.status(400).json({ error: Object.entries(err).length == 0 ? err.message : err });
};
exports.default = errorHandler;
