import roomModel from "../models/room.model.js";
import { addUsersToRoom, createRoom, getAllRoomByUserId, getRoomById } from "../services/room.service.js";
import { validationResult } from "express-validator";


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
    console.log(error);

    res.status(400).json({ error: error.message });
  }
};

export const getAllRoomsController = async (req, res) => {
  try {
    const userId = req.user.id;
    const allUserRooms = await getAllRoomByUserId({ userId: userId });

    return res.status(200).json({ rooms: allUserRooms });
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
};

export const addUserToRoomController = async (req , res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({errors: errors.array})
  }
  try {
    const { roomId, users} = req.body
    const userId = req.user.id;

    const room =await addUsersToRoom({ roomId, users, userId: userId })

    return res.status(200).json({
      room
    })

  } catch (error) {
    console.log(error)
    res.status(400).json({error: error.message})
  }
}


export const getRoomByIdController = async (req, res) => {

    const { roomId } = req.params;

    try {

        const room = await getRoomById({ roomId });

        return res.status(200).json({
            room
        })

    } catch (err) {
        console.log(err)
        res.status(400).json({ error: err.message })
    }

}