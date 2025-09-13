import { hash } from 'bcrypt';
import prisma from '../prismaClient.js';


// Register user
export async function registerUser(req, res) {
    try {
        const { name, email, password} = req.body;

        // hash the password
        const passwordHash = await hash(password, 10);

        // save user in db
        const user = await _user.create({
            data: { name, email, passwordHash },
        });

        res.status(201).json({
            message: "User created",
            user: { id: user.id, name: user.name, email: user.email }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong" });
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