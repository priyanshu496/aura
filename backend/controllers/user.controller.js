import userModel from "../models/user.model.js";
import * as userService from "../services/user.service.js";
import { validationResult } from "express-validator";
import redisClient from "../services/redis.service.js";

export const userSignupController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const user = await userService.createUser(req.body);
    const token = await user.generateJWT();
    delete user._doc.password;

    res.status(201).json({ user, token });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

export const userSigninController = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email }).select("password");

    if (!user) {
      console.log("Invalid credentials");
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.isValidPassword(password);

    if (!isMatch) {
      console.log("wrong password");
      return res.status(401).json({ errors: "Invalid credentials" });
    }

    const token = await user.generateJWT();
    delete user._doc.password;
    res.status(200).json({ user, token });
  } catch (error) {
    return res.status(400).send(error.message);
  }
};

export const profileController = async (req, res) => {
  console.log(req.user);
  res.status(200).json({
    user: req.user,
  });
};

export const userSignoutController = async (req, res) => {
  try {
    const token = req.cookies.token || req.headers.authorization.split(" ")[1];

    redisClient.set(token, "logout", "EX", 60 * 60 * 24);
    res.status(200).send("Logged out successfully");
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
};
