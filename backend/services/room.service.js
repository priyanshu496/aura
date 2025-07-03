import roomModel from "../models/room.model.js";

const createRoom =async ({
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

export default createRoom;

