"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//Class Model utk nyiapin type schema methods ny
//link: https://mongoosejs.com/docs/typescript/statics-and-methods.html
const mongoose_1 = require("mongoose");
const bcrypt_1 = __importDefault(require("bcrypt"));
const mongoose_unique_validator_1 = __importDefault(require("mongoose-unique-validator"));
const isEmail_1 = __importDefault(require("validator/lib/isEmail"));
const studentSchema = new mongoose_1.Schema({
    username: {
        type: String,
        unique: true,
        required: [true, "username required"],
    },
    school: {
        type: String,
        required: false,
    },
    location: {
        type: String,
        required: false,
    },
    description: {
        type: String,
        required: false,
    },
    picture: {
        type: String,
        required: false,
    },
    email: {
        type: String,
        unique: true,
        //mongoose Validation
        required: [true, "email required"],
        validate: {
            validator: isEmail_1.default,
            message: "please provide a valid email",
        },
    },
    password: {
        type: String,
        required: [true, "password required"],
    },
});
//kareno untuk ngecek "unique" itu harus dilakuken samo mongodbnyo langsung,
//(dak biso si mongoose nyo bae) jadi pakek third party package untuk nge set
//error message custom pas ado yg input dak unique "mongoose-unique-validator"
studentSchema.plugin(mongoose_unique_validator_1.default, {
    message: '{PATH} "{VALUE}" already used',
});
//kalo namonyo "save" berarti dijalanin pas lagi save, pre berarti sebelum
studentSchema.pre("save", function (next) {
    //isModified utk ngecek kalo password lagi
    //diganti atau blm ado kalo iyo, return yes,
    //jadi dio buat hashed password, idak lgsg
    //dilanjut ke fungsi selanjutnyo bae ckitu
    if (!this.isModified("password"))
        next();
    let student = this;
    bcrypt_1.default.genSalt(parseInt(process.env.SALT_WORK_FACTOR, 10), function (err, salt) {
        if (err)
            return next(err);
        bcrypt_1.default.hash(student.password, salt, function (err, hash) {
            if (err)
                return next(err);
            else {
                student.password = hash;
                next();
            }
        });
    });
});
studentSchema.method("comparePassword", function (inputPassword, cb) {
    bcrypt_1.default.compare(inputPassword, this.password, function (err, isMatch) {
        if (err)
            return cb(err);
        cb(null, isMatch);
    });
});
const Student = (0, mongoose_1.model)("Student", studentSchema);
exports.default = Student;
