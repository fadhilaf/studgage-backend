//Class Model utk nyiapin type schema methods ny
//link: https://mongoosejs.com/docs/typescript/statics-and-methods.html
import { Schema, Model, model } from "mongoose";

import isEmail from "validator/lib/isEmail";
import bcrypt from "bcrypt";

export interface IStudent {
  username: string;
  email: string;

  //hashing password pakai mongoose schema middleware dan schema function
  //link: https://www.mongodb.com/blog/post/password-authentication-with-mongoose-part-1
  password: string;

  school?: string;
  location?: string;
  description?: string;
  picture?: string;
}

interface IStudentMethods {
  comparePassword(
    password: string,
    cb: (err: unknown, isMatch?: boolean) => void
  ): void;
}

//maybe seems like unneccessary but this was on the docs bruh
type StudentModel = Model<IStudent, {}, IStudentMethods>;

const studentSchema = new Schema<IStudent, StudentModel>({
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
    required: [true, "email required"],
    validate: {
      validator: isEmail,
      message: "Please provide a valid email",
    },
  },
  password: {
    type: String,
    required: [true, "password required"],
  },
});

//kalo namonyo "save" berarti dijalanin pas lagi save, pre berarti sebelum
studentSchema.pre("save", function (next): void {
  //isModified utk ngecek kalo password lagi
  //diganti atau blm ado kalo iyo, return yes,
  //jadi dio buat hashed password, idak lgsg
  //dilanjut ke fungsi selanjutnyo bae ckitu
  if (!this.isModified("password")) next();
  else {

  }
  let student = this;

  bcrypt.genSalt(
    parseInt(process.env.SALT_WORK_FACTOR!, 10),
    function (err, salt) {
      if (err) return next(err);
      else {
        bcrypt.hash(student.password, salt, function (err, hash) {
          if (err) return next(err);
          else {
            student.password = hash;
            next();
          }
        });
      }
    }
  );

});

studentSchema.method(
  "comparePassword",
  function (
    inputPassword: string,
    cb: (err: unknown, isMatch?: boolean) => void
  ) {
    bcrypt.compare(inputPassword, this.password, function (err, isMatch) {
      if (err) return cb(err);

      cb(null, isMatch);
    });
  }
);

const Student = model<IStudent, StudentModel>("Student", studentSchema);

export default Student;
