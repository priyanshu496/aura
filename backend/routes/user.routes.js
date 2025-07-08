import { Router } from 'express';
import * as userController from '../controllers/user.controller.js';
import { body } from 'express-validator';
import * as authMiddleware from '../middleware/auth.middleware.js';

const router = Router();



router.post('/signup',
    body('email').isEmail().withMessage('Email must be a valid email address'),
    body('password').isLength({ min: 3 }).withMessage('Password must be at least 3 characters long'),
    userController.userSignupController);

router.post('/signin',
    body('email').isEmail().withMessage('Email must be a valid email address'),
    body('password').isLength({ min: 3 }).withMessage('Password must be at least 3 characters long'),
    userController.userSigninController);

router.get('/profile', authMiddleware.authUser, userController.profileController);


router.get('/signout', authMiddleware.authUser, userController.userSigninController);


router.get('/all', authMiddleware.authUser, userController.getAllUsersController);


export default router;
