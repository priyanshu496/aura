import roomModel from "../models/room.model.js";
import createRoom from "../services/room.service.js";
import { validationResult } from "express-validator";
import User from "../models/user.model.js";



export const createRoomController = async (req, res) => {

  const errors = validationResult(req);


  if (!errors.isEmpty()) {

    return res.status(400).json({ errors: errors.array });
  }

  try {

    const { name } = req.body;

    
    //comming from jwt token
    const userId = req.user.id; 

    
    const newRoom = await createRoom({ name, userId });

    res.status(201).json(newRoom);
  } catch (error) {

    console.log(error)

    res.status(400).json({ error: error.message });
  }
};
