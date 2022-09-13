import { RequestHandler } from "express";
import Student from "../models/student.model";

const sessionRead: RequestHandler = async (req, res, next) => {

  if (req.session?.userId) {
    const studentId = req.session.userId;
    const student = await Student.findById(studentId);

    if (!student) next(new Error("Student Id in the session invalid"));

    req.student = {
      id: student!._id,
      username: student!.username,
    };
    
    if ((req.originalUrl === "/auth/login" || req.originalUrl === "/auth/signup") && (req.method === "POST"))
      return next(new Error("You already have a session, logout before you need to login/signup again"));


    next();
  }

  next();

};

export default sessionRead;
