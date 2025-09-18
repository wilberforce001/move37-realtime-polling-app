# Real-Time Polling Application

This is a backend service for real-time polling application built with **Node.js, Express, PostgreSQL, Prisma, and WebSockets**. This application allows users to create polls, vote on poll options, and receive **live results in real-time**. 

## Features 
- **User Management**: Create and retrive users.
- **Polls & Options**: Create polls with multiple options 
- **Voting system**: Cast votes on poll options.
- **Real-Time Updates**: Websocket support for live poll results.
- **RESTful API**: CRUD endpoints for users, polls, options, and Vote.  
- **Separation of Concerns**: Backend (/backend) and frontend (/frontend) organized as separate apps. 

## Tech Stack
- **Backend Framework**: Node.js with Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Real-Time Communication**: WebSockets (Socket.IO)
- **Authentication & Authorization**: JWT
- **Password hashing**: Bcrypt

## Project Setup
### 1. Clone the Repository
- git clone git@github.com:wilberforce001/move37-polling-backend.git  
cd move37-realtime-polling-app

### 2. Backend Setup
- cd backend
- npm install

#### Run Prisma Migrations
- npx prisma migrate dev --name init
- Start backend - npm run dev
- API will be available at: http://localhost:4000/api

#### Install Dependencies
- **install runtime deps**: npm install express cors socket.io @prisma/client bcrypt dotenv
- **install dev deps**: npm install -D prisma nodemon
- **initialize prisma for postgres**: npm prisma init --datasource-provider postgresql

#### Set Up Environment Variables 
- Create a .env file in /backend with the following 
- DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/- pollingdb"
- JWT_SECRET="yoursecretkey"
- PORT=4000

#### Start the Server
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

### WebSockets
- Client can connect via WebSocket to receive **live updates**
- When a vote is cast, all connected clients viewing that poll receive the uodated results instantly. 

## Evaluation Focus
- Database Schema design (Prisma with correct relationships)
- Clean, well-structured code following best practices
- Efficient real-time updates via WebSockets
- Functional and documented RESTful API

### 3. Frontend Setup
- cd frontend
- npm install
- npm start 

#### Authentication Flow  
- Register → Create a new account.  
- Login → Get a JWT token.  
- Protected Routes → Creating polls and voting requires authentication.  
- Token is stored in localStorage and sent with API requests.

### How Voting Works  
#### When a user votes: 
- The vote is saved in the database with the userId and pollId.  
- Duplicate votes are prevented (a user can only vote once per poll).  
- Results are emitted in realtime via Socket.IO.

## Author
Developed by Kipyegon Wilberforce for the **Move37 Ventures Backend Challenge**. 