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
const student_model_1 = __importDefault(require("../models/student.model"));
const sessionRead = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if ((_a = req.session) === null || _a === void 0 ? void 0 : _a.userId) {
        const userId = req.session.userId;
        const user = yield student_model_1.default.findById(userId);
        if (!user)
            return next(new Error("Student Id in the session invalid"));
        req.user = {
            id: user._id,
            username: user.username,
            picture: user.picture,
        };
        if ((req.originalUrl === "/auth/login" || req.originalUrl === "/auth/signup") && (req.method === "POST"))
            return next(new Error("you already have a session, logout before you need to login/signup again"));
        return next();
    }
    return next();
});
exports.default = sessionRead;
