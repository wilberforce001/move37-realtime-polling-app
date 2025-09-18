import bcrypt from 'bcrypt';
import prisma from '../prismaClient.js';
import jwt from "jsonwebtoken"

// Register user
export async function registerUser(req, res) {
    try {
        const { name, email, password } = req.body;

        // hash the password
        const passwordHash = await bcrypt.hash(password, 10);

        // check how many users exist already
        const userCount = await prisma.user.count();

        // first user becomes ADMIN, others become USER
        const role = userCount === 0 ? "ADMIN" : "USER";

        // save user in db
        const user = await prisma.user.create({
            data: { name, email, passwordHash, role },
        });

        res.status(201).json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong" });
    }
}


// login
export const loginUser = async (req, res) => {
  try {
    // const { email, password } = req.body;

    // find user
    const user = await prisma.user.findUnique({ where: { email: req.body.email } });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // compare password
    const isValid = await bcrypt.compare(req.body.password, user.passwordHash);
    if (!isValid) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // sign JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // email: user.email
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
};

export function isAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Malformed auth header" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded || decoded.role !== "ADMIN") {
      return res.status(403).json({ message: "Forbidden: Admins only" });
    }

    req.user = decoded; // attach full decoded token for downstream use
    return next();
  } catch (err) {
    console.error("JWT verification failed:", err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

export async function getUser(req, res) {
    try {
        const id = Number(req.params.id);
        const user = await prisma.user.findUnique({
            where: { id },
            select: { id: true, name: true, email: true }
        });
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export async function listUsers(req, res) {
    try {
        const users = await prisma.user.findMany({
            select: { id: true, name: true, email: true }
        });
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message});
    }
}