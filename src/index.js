require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const { server } = require('socket.io');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
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

// import / mount routes 
const userRoutes = require('./routes/users');
const pollRoutes = require('./routes/polls');

app.use('/api/users', userRoutes);
app.use('/api/polls', pollRoutes);

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`listening on ${PORT}`));


// Reference: https://socket.io/docs/v3/rooms/?utm_source=chatgpt.com
