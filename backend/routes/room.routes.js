import { Router } from 'express';
import { body } from 'express-validator';
import * as roomController from '../controllers/room.controller.js';
import * as authMiddleWare from '../middleware/auth.middleware.js';

const router = Router();


router.post('/create',
    authMiddleWare.authUser,
    body('name').isString().withMessage('Name is required'),
    roomController.createRoom
)

router.get('/all',
    authMiddleWare.authUser,
    roomController.getAllRoom
)

router.put('/add-user',
    authMiddleWare.authUser,
    body('roomId').isString().withMessage('Room ID is required'),
    body('users').isArray({ min: 1 }).withMessage('Users must be an array of strings').bail()
        .custom((users) => users.every(user => typeof user === 'string')).withMessage('Each user must be a string'),
    roomController.addUserToRoom
)

router.get('/get-room/:roomId',
    authMiddleWare.authUser,
    roomController.getRoomById
)

router.put('/update-file-tree',
    authMiddleWare.authUser,
    body('roomId').isString().withMessage('Room ID is required'),
    body('fileTree').isObject().withMessage('File tree is required'),
    roomController.updateFileTree
)


export default router;