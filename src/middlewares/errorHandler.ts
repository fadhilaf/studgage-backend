import { ErrorRequestHandler } from "express";

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.log(err.message);
  res.json({error: err.message});
}

export default errorHandler;
