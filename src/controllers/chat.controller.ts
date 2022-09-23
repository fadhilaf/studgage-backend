import { RequestHandler } from "express";
import { sign } from "jsonwebtoken";

const getWebsocketToken: RequestHandler = (req, res, next) => {
  const token = sign({ id: req.user!.id.toString() }, process.env.TOKEN_KEY!, {
    expiresIn: "12h",
  });

  return res.json({ token });
};

export default {
  getWebsocketToken,
};
