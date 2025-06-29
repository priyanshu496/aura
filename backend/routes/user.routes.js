import express from "express";
import * as userController from "../controllers/user.controller.js";
import { body } from "express-validator";

const userRouter = express.Router();

userRouter.post(
  "/register",
  body("email").isEmail().withMessage("Email must be valid email adress"),
  body("password")
    .isLength({ min: 3 })
    .withMessage("Password should be minimum 3 characters long"),
  userController.createUserController
);

export default userRouter