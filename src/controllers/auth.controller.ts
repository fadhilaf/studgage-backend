import { RequestHandler, Request, Response, NextFunction } from "express";
import Student, { IStudent } from "../models/student.model";

const getAuthenticatedData: RequestHandler = (req, res, next) => {
  if (req?.student) {
    res.json({data: req!.student});
  } else {
    return next(new Error("You Are Still Not Authenticated"));
  }
};

const signUp: RequestHandler = (req, res, next) => {
  const body: IStudent = req.body;

  const student = new Student(body);

  student.save((err) => {
    if (err) next(err);
    else res.json({ message: "Account Successfully Made" });
  });
};

const login: RequestHandler = async (req, res, next) => {
  const body: { username: string; password: string } = req.body;

  try {
    const student = await Student.findOne({ username: body.username });

    if (!student)
      next(
        new Error("Couldn't Find The Account With Username " + body.username)
      );

    student?.comparePassword(
      body.password,
      (err: unknown, isMatch?: boolean) => {
        if (err) next(err);
        else {
          if (isMatch) {
            req.session.userId = student._id;

            res.json({ message: "Successfully Logged In" });
          } else {
            next(new Error("Wrong Password"));
          }
        }
      }
    );
  } catch (err) {
    next(err);
  }
};

export default {
  getAuthenticatedData,
  signUp,
  login,
};
