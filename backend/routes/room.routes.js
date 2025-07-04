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

roomRouter.get("/all", isUser, roomController.getAllRoomsController);

roomRouter.put(
  "/add-user",
  isUser,
  body('roomId').isString().withMessage('Room ID is required'),
  body("users")
    .isArray({ min: 1 })
    .withMessage("Users must be an array of strings")
    .bail()
    .custom((users) => users.every((user) => typeof user === "string"))
    .withMessage("Each user must be a string"),
  roomController.addUserToRoomController
);

roomRouter.get('/get-room/:roomId', isUser, roomController.getRoomByIdController)


export default roomRouter;
