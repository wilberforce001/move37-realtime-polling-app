import { Router } from 'express';
const router = Router();
import { registerUser, getUser } from '../controllers/userController.js';

// Example POST /api/users
router.post('/users', registerUser);
router.get('/:id', getUser);
router.post('/', async (req, res) => {
  const { name, email, password } = req.body;

  // TODO: Save to DB with Prisma
  res.status(201).json({ message: 'User created', user: { name, email } });
});

export default router; 