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
        const studentId = req.session.userId;
        const student = yield student_model_1.default.findById(studentId);
        if (!student)
            next(new Error("Student Id in the session invalid"));
        req.student = {
            id: student._id,
            username: student.username,
            email: student.email,
        };
        if ((req.originalUrl === "/auth/login" || req.originalUrl === "/auth/signup") && (req.method === "POST"))
            return next(new Error("You already have a session, logout before you need to login/signup again"));
        next();
    }
    next();
});
exports.default = sessionRead;
