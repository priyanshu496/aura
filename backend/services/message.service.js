import messageModel from '../models/message.model.js';
import mongoose from 'mongoose';

export const createMessage = async ({ roomId, sender, content }) => {
    if (!roomId || !sender || !content) {
        throw new Error('roomId, sender, and content are required');
    }

    if (!mongoose.Types.ObjectId.isValid(roomId)) {
        throw new Error('Invalid roomId');
    }

    if (sender !== 'auraAI' && !mongoose.Types.ObjectId.isValid(sender)) {
        throw new Error('Invalid sender');
    }

    const message = await messageModel.create({
        roomId,
        sender,
        content
    });


    if (sender === 'auraAI') {
        
        return {
            ...message.toObject(),
            sender: {
                _id: 'auraAI',
                email: 'AI'
            }
        };
    } else {
       
        const populatedMessage = await messageModel.findById(message._id).populate('sender', 'email');
        return populatedMessage;
    }
};

export const getMessagesByRoomId = async ({ roomId }) => {
    if (!roomId) {
        throw new Error('roomId is required');
    }

    if (!mongoose.Types.ObjectId.isValid(roomId)) {
        throw new Error('Invalid roomId');
    }

    const messages = await messageModel.find({ roomId })
        .sort({ createdAt: 1 }); 


    const processedMessages = await Promise.all(messages.map(async (message) => {
        if (message.sender === 'auraAI') {
            return {
                ...message.toObject(),
                sender: {
                    _id: 'auraAI',
                    email: 'AI'
                }
            };
        } else {
           
            const populatedMessage = await messageModel.findById(message._id).populate('sender', 'email');
            return populatedMessage;
        }
    }));

    return processedMessages;
};

export const deleteMessagesByRoomId = async ({ roomId }) => {
    if (!roomId) {
        throw new Error('roomId is required');
    }

    if (!mongoose.Types.ObjectId.isValid(roomId)) {
        throw new Error('Invalid roomId');
    }

    const result = await messageModel.deleteMany({ roomId });
    return result;
};