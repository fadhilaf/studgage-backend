import { RequestHandler } from "express";
import Student from "../models/student.model";

const sessionRead: RequestHandler = async (req, res, next) => {

  if (req.session?.userId) {
    const userId = req.session.userId;
    const user = await Student.findById(userId);

    if (!user) next(new Error("Student Id in the session invalid"));

    req.user = {
      id: user!._id,
      username: user!.username,
      picture: user!.picture!,
    };
    
    if ((req.originalUrl === "/auth/login" || req.originalUrl === "/auth/signup") && (req.method === "POST"))
      return next(new Error("you already have a session, logout before you need to login/signup again"));


    next();
  }

  next();

};

export default sessionRead;
