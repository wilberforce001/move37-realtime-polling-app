import { Router } from 'express';
const router = Router();
import { registerUser, getUser, listUsers, loginUser } from '../controllers/userController.js';

// create a user
router.post('/register', registerUser);

// list all users 
router.get('/', listUsers);

// get a single user
router.get('/:id', getUser);

// new login endpoint
router.post("/login", loginUser);

export default router; 