import jwt from "jsonwebtoken";
import redisClient from "../services/redis.service.js";
const isUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = req.cookies.token || (authHeader && authHeader.split(" ")[1]);

    if (!token) {
      return res.status(401).send({ error: "Unauthorized User" });
    }

    const isBlackListed = await redisClient.get(token);

    if (isBlackListed) {
      res.cookie("token", "");

      return res.status(401).send({ error: "Unauthorized User" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.log(error);

    res.status(401).send({ error: "Unauthorized User" });
  }
};

export default isUser;
