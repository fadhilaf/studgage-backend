import { ErrorRequestHandler } from "express";

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.log(err.message)

  res.json({ error: Object.entries(err).length == 0 ? err.message : err });
};

export default errorHandler;
