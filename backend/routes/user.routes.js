import express from "express";
import * as userController from "../controllers/user.controller.js";
import { body } from "express-validator";
import * as authMiddleware from "../middlewares/auth.middleware.js";

const userRouter = express.Router();

userRouter.post(
  "/register",
  body("email").isEmail().withMessage("Email must be valid email adress"),
  body("password")
    .isLength({ min: 3 })
    .withMessage("Password should be minimum 3 characters long"),
  userController.userRegisterController
);

userRouter.post(
  "/login",
  body("email").isEmail().withMessage("Email must be valid email adress"),
  body("password")
    .isLength({ min: 3 })
    .withMessage("Password should be minimum 3 characters long"),
  userController.userLoginController
);

userRouter.get(
  "/profile",
  authMiddleware.isUser,
  userController.profileController
);

userRouter.get('/logout', authMiddleware.isUser, userController.userLogoutController)

export default userRouter;
