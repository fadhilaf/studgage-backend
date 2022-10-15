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
const getAuthenticatedData = (req, res, next) => {
    return res.json({ data: req.user });
};
const getOthersData = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let data;
    try {
        data = yield student_model_1.default.findById(req.params.id);
    }
    catch (err) {
        return next(err);
    }
    if (!data) {
        return next(new Error("user id didnt exist"));
    }
    else {
        return res.json({
            data: { id: data._id, username: data.username, profile: data === null || data === void 0 ? void 0 : data.picture },
        });
    }
});
exports.default = {
    getAuthenticatedData,
    getOthersData,
};
