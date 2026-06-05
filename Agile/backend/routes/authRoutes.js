import express from 'express';
import { registerUser, loginUser, refresh, logout } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/refresh', refresh);
router.post('/logout', logout);

export default router;
