import * as roomService from '../services/room.service.js';
import userModel from '../models/user.model.js';
import { validationResult } from 'express-validator';


export const createRoom = async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {

        const { name } = req.body;
        const loggedInUser = await userModel.findOne({ email: req.user.email });
        const userId = loggedInUser._id;

        const newRoom = await roomService.createRoom({ name, userId });

        res.status(201).json(newRoom);

    } catch (err) {
        console.log(err);
        res.status(400).send(err.message);
    }



}

export const getAllRoom = async (req, res) => {
    try {

        const loggedInUser = await userModel.findOne({
            email: req.user.email
        })

        const allUserRooms = await roomService.getAllRoomByUserId({
            userId: loggedInUser._id
        })

        return res.status(200).json({
            rooms: allUserRooms
        })

    } catch (err) {
        console.log(err)
        res.status(400).json({ error: err.message })
    }
}

export const addUserToRoom = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {

        const { roomId, users } = req.body

        const loggedInUser = await userModel.findOne({
            email: req.user.email
        })


        const room = await roomService.addUsersToRoom({
            roomId,
            users,
            userId: loggedInUser._id
        })

        return res.status(200).json({
            room,
        })

    } catch (err) {
        console.log(err)
        res.status(400).json({ error: err.message })
    }


}

export const getRoomById = async (req, res) => {

    const { roomId } = req.params;

    try {

        const room = await roomService.getRoomById({ roomId });

        return res.status(200).json({
            room
        })

    } catch (err) {
        console.log(err)
        res.status(400).json({ error: err.message })
    }

}

export const updateFileTree = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {

        const { roomId, fileTree } = req.body;

        const room = await roomService.updateFileTree({
            roomId,
            fileTree
        })

        return res.status(200).json({
            room
        })

    } catch (err) {
        console.log(err)
        res.status(400).json({ error: err.message })
    }

}