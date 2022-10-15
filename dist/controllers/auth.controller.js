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
const signUp = (req, res, next) => {
    const body = req.body;
    const student = new student_model_1.default(body);
    student.save((err) => {
        if (err)
            return next(err);
        return res.json({ message: "account Successfully Made" });
    });
};
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    try {
        const student = yield student_model_1.default.findOne({ username: body.username });
        if (!student)
            return next(new Error("couldn't find the account with username " + body.username));
        student.comparePassword(body.password, (err, isMatch) => {
            if (err)
                return next(err);
            if (isMatch) {
                req.session.userId = student._id;
                return res.json({ message: "successfully logged in" });
            }
            return next(new Error("wrong password"));
        });
    }
    catch (err) {
        return next(err);
    }
});
const logout = (req, res, next) => {
    req.session.destroy((err) => {
        if (err)
            return next(err);
    });
    return res.json({ message: "successfully logged out" });
};
exports.default = {
    signUp,
    login,
    logout,
};
