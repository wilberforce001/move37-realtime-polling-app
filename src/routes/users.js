import { Router } from 'express';
const router = Router();
import { registerUser, getUser, listUsers } from '../controllers/userController.js';

// create a user
router.post('/', registerUser);

// list all users 
router.get('/', listUsers);

// get a single user
router.get('/:id', getUser);

export default router; 