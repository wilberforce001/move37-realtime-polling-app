const express = require('express');
const router = express.Router();

// Example POST /api/users
router.post('/', async (req, res) => {
  const { name, email, password } = req.body;

  // TODO: Save to DB with Prisma
  res.status(201).json({ message: 'User created', user: { name, email } });
});

module.exports = router;
