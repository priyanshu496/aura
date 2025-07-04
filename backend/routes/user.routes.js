import express from "express";
import * as userController from "../controllers/user.controller.js";
import { body } from "express-validator";
import  isUser from "../middlewares/auth.middleware.js";

const userRouter = express.Router();

userRouter.post(
  "/signup",
  body("email").isEmail().withMessage("Email must be valid email adress"),
  body("password")
    .isLength({ min: 3 })
    .withMessage("Password should be minimum 3 characters long"),
  userController.userSignupController
);

userRouter.post(
  "/signin",
  body("email").isEmail().withMessage("Email must be valid email adress"),
  body("password")
    .isLength({ min: 3 })
    .withMessage("Password should be minimum 3 characters long"),
  userController.userSigninController
);

userRouter.get(
  "/profile",
  isUser,
  userController.profileController
);

userRouter.get('/logout', isUser, userController.userSignoutController)


userRouter.get('/all', isUser, userController.getAllUsersController);

export default userRouter;
