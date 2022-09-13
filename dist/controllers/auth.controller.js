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
            next(err);
        res.json({ message: "Account Successfully Made" });
    });
};
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    try {
        const student = yield student_model_1.default.findOne({ username: body.username });
        if (!student)
            next(new Error("Couldn't Find The Account With Username " + body.username));
        student === null || student === void 0 ? void 0 : student.comparePassword(student.password, (err, isMatch) => {
            if (err)
                next(err);
            if (isMatch) {
                res.json({ message: "Successfully Logged In" });
            }
            else {
                next(new Error("Wrong Password"));
            }
        });
    }
    catch (err) {
        next(err);
    }
});
exports.default = {
    signUp,
    login,
};
