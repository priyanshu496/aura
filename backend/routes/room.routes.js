import express from "express";
import { body } from "express-validator";
import * as roomController from "../controllers/room.controller.js";
import isUser from "../middlewares/auth.middleware.js";

const roomRouter = express.Router();

roomRouter.post(
  "/create",
  isUser,
  body("name").isString().withMessage("Name is required"),
  roomController.createRoomController
);

export default roomRouter;
