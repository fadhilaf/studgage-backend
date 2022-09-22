import { RequestHandler } from "express";
import Student, { IStudent } from "../models/student.model";

const getAuthenticatedData: RequestHandler = (req, res, next) => {
  res.json({ data: req.user! });
};

export default {
  getAuthenticatedData,
}
