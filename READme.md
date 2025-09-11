# Real-Time Polling Application

This is a backend service for real-time polling application built with **Node.js, Express, PostgresSQL, Prisma, and WebSockets**. This application allows users to create polls, vote on poll options, and receive **live results in real-time**. 

## Features 
- **User Management**: Create and retrive users.
- **Polls & Options**: Create polls with multiple options 
- **Voting system**: Cast votes on poll options.
- **Real-Time Updates**: Websocket support for live poll results.
- **RESTful API**: CRUD endpoints for users, polls, options, and Vote. 

## Tech Stack
- **Backend Framework**: Node.js with Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Real-Time Communication**: WebSockets (Socket.IO or ws)

## Project Setup
### 1. Clone the Repository
- git clone git@github.com:wilberforce001/move37-polling-backend.git  
cd move37-polling-backend.git

### 2. Install Dependencies
- **install runtime deps**: npm install express cors socket.io @prisma/client bcrypt dotenv
- **install dev deps**: npm install -D prisma nodemon
- **initialize prisma for postgres**: npm prisma init --datasource-provider postgresql

### 3. Set Up Environment Variables 
- Created a .env in the root directory

### 4. Prisma Setup
- npx prisma migrate dev ---name init
- npx prisma generate

### 5. Start the Server
- npm run dev

## API Endpoints
### Users
- POST /api/users ---> Create a user
- GET /api/users/:id ---> Get a user by ID

### Polls
- POST /api/polls ---> Create a poll with options
- GET /api/polls/:id ---> Get a poll with its options

### Votes 
- POST /api/votes ---> Cast a vote for a poll option

## WebSockets
- Client can connect via WebSocket to receive **live updates**
- When a vote is cast, all connected clients viewing that poll receive the uodated results instantly. 

## Evaluation Focus
- Database Schema design (Prisma with correct relationships)
- Clean, well-structured code following best practices
- Efficient real-time updates via WebSockets
- Functional and documented RESTful API

## Author
Developed by Kipyegon Wilberforce for the **Move37 Ventures Backend Challenge**. 