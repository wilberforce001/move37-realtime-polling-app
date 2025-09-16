import express, { json } from 'express';
import { createServer } from 'http';
import cors from 'cors';
import { Server } from 'socket.io';
import dotenv from 'dotenv'
import pollRoutes from './routes/polls.js'
import userRoutes from './routes/users.js';
dotenv.config(); 

const app = express();
app.use(cors());
app.use(express.json());

const server = createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

// simple socket rooms for polls
io.on('connection', (socket) => {
  console.log('socket connected', socket.id);

  socket.on('joinPoll', (pollId) => {
    socket.join(`poll_${pollId}`);
  });

  socket.on('leavePoll', (pollId) => {
    socket.leave(`poll_${pollId}`);
  });

  socket.on('disconnect', () => {
    console.log('socket disconnected', socket.id);
  });
});

// make io available to route handlers
app.set('io', io);

// mount routes
app.use('/api/users', userRoutes);
app.use('/api/polls', pollRoutes);

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`listening on ${PORT}`));
