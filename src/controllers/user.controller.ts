import { RequestHandler } from "express";
import Student from "../models/student.model";

const getAuthenticatedData: RequestHandler = (req, res, next) => {
  return res.json({ data: req.user! });
};

const getOthersData: RequestHandler = async (req, res, next) => {
  let data;
  try {
    data = await Student.findById(req.params.id);
  } catch (err: unknown) {
    return next(err);
  }

  if (!data) {
    return next(new Error("user id didnt exist"));
  } else {
    return res.json({
      data: { id: data._id, username: data.username, profile: data?.picture },
    });
  }
};
export default {
  getAuthenticatedData,
  getOthersData,
};
