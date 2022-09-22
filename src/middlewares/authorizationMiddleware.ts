import { RequestHandler } from "express";

const authorizationMiddleware: RequestHandler = (req, res, next) => {
  if (req.user) {
    return next();
  }

  return next(new Error("You are not authenticated"))
}
export default authorizationMiddleware;
