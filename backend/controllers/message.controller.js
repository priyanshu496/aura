import * as messageService from '../services/message.service.js';
import { validationResult } from 'express-validator';
import userModel from '../models/user.model.js';

export const createMessage = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { roomId, content, sender } = req.body;
        const userEmail = req.user.email;

        let senderId;

        if (sender === 'auraAI') {
            senderId = 'auraAI';
        } else {
     
            const user = await userModel.findOne({ email: userEmail });
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            senderId = user._id;
        }

        const message = await messageService.createMessage({
            roomId,
            sender: senderId,
            content
        });

        res.status(201).json({
            message: 'Message created successfully',
            data: message
        });

    } catch (error) {
        console.error('Error creating message:', error);
        res.status(500).json({ error: error.message });
    }
};

export const getMessagesByRoomId = async (req, res) => {
    try {
        const { roomId } = req.params;

        if (!roomId) {
            return res.status(400).json({ error: 'Room ID is required' });
        }

        const messages = await messageService.getMessagesByRoomId({ roomId });

        res.status(200).json({
            message: 'Messages retrieved successfully',
            messages
        });

    } catch (error) {
        console.error('Error retrieving messages:', error);
        res.status(500).json({ error: error.message });
    }
};