import { Router } from 'express';
import { body } from 'express-validator';
import * as messageController from '../controllers/message.controller.js';
import * as authMiddleware from '../middleware/auth.middleware.js';

const router = Router();

router.post('/create',
    authMiddleware.authUser,
    body('roomId').isString().withMessage('Room ID is required'),
    body('content').isString().withMessage('Content is required'),
    body('sender').optional().isString().withMessage('Sender must be a string'), 
    messageController.createMessage
);

router.get('/room/:roomId',
    authMiddleware.authUser,
    messageController.getMessagesByRoomId
);

export default router;