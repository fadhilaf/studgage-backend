import { RequestHandler } from "express";

const getAuthenticatedData: RequestHandler = (req, res, next) => {
  res.json({ data: req.user! });
};

export default {
  getAuthenticatedData,
}
