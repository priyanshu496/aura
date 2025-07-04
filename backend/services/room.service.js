import roomModel from "../models/room.model.js";
import mongoose from "mongoose";


export const createRoom =async ({
    name, userId
}) => {
    if (!name) {
        throw new Error('Name is required')
    }
    if (!userId) {
        throw new Error('UserId is required')
    }

    let room;
    try {
        room = await roomModel.create({
            name,
            users: [ userId ]
        });
    } catch (error) {
        if (error.code === 11000) {
            throw new Error('room name already exists');
        }
        throw error;
    }

    return room;

}

export const getAllRoomByUserId = async ({userId}) => {
    if(!userId){
        throw new Error('User id is required')
    }
    const allUserRooms = await roomModel.find({
        users: userId
    })

    return allUserRooms;
}


export const addUsersToRoom = async ({ roomId, users, userId }) => {
  if (!roomId) {
    throw new Error("projectId is required");
  }

  if (!mongoose.Types.ObjectId.isValid(roomId)) {
    throw new Error("Invalid roomId");
  }

  if (!users) {
    throw new Error("users are required");
  }

  if (
    !Array.isArray(users) ||
    users.some((userId) => !mongoose.Types.ObjectId.isValid(userId))
  ) {
    throw new Error("Invalid userId(s) in users array");
  }

  if (!userId) {
    throw new Error("userId is required");
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid userId");
  }

  const room = await roomModel.findOne({
    _id: roomId,
    users: userId,
  });

  console.log(room);

  if (!room) {
    throw new Error("User not belong to this room");
  }

  const updatedRoom = await roomModel.findOneAndUpdate(
    {
      _id: roomId,
    },
    {
      $addToSet: {
        users: {
          $each: users,
        },
      },
    },
    {
      new: true,
    }
  );

  return updatedRoom;
};



export const getRoomById = async ({ roomId }) => {
    if (!roomId) {
        throw new Error("roomId is required")
    }

    if (!mongoose.Types.ObjectId.isValid(roomId)) {
        throw new Error("Invalid roomId")
    }

    const room = await roomModel.findOne({
        _id: roomId
    }).populate('users')

    return room;
}