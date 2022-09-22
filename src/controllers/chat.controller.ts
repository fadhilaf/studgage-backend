import { RequestHandler } from "express";
import { sign } from "jsonwebtoken";

const getWebsocketToken: RequestHandler = (req, res, next) => {
  const token = sign({ id: req.user!.id }, process.env.TOKEN_KEY!, {
    expiresIn: "5m",
  });

  return res.json({ token });
};

export default {
  getWebsocketToken,
};
