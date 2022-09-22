import { RequestHandler } from "express";
import Student, { IStudent } from "../models/student.model";

const signUp: RequestHandler = (req, res, next) => {
  const body: IStudent = req.body;

  const student = new Student(body);

  student.save((err) => {
    if (err) return next(err);

    return res.json({ message: "Account Successfully Made" });
  });
};

const login: RequestHandler = async (req, res, next) => {
  const body: { username: string; password: string } = req.body;

  try {
    const student = await Student.findOne({ username: body.username });

    if (!student)
      return next(
        new Error("Couldn't Find The Account With Username " + body.username)
      );

    student!.comparePassword(
      body.password,
      (err: unknown, isMatch?: boolean) => {
        if (err) return next(err);

        if (isMatch) {
          req.session.userId = student!._id;

          return res.json({ message: "Successfully Logged In" });
        }

        return next(new Error("Wrong Password"));
      }
    );
  } catch (err) {
    return next(err);
  }
};

const logout: RequestHandler = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) return next(err);
  });

  return res.json({ message: "Successfully logged out" });
};

export default {
  signUp,
  login,
  logout,
};
