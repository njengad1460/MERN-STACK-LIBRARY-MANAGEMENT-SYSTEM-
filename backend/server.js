const express = require('express');  //Web framework for handling HTTP requests
const cors = require('cors'); // Allows cross-origin requests (frontend can talk to backend)
const dotenv = require('dotenv');
const http = require('http');  //  Node's built-in HTTP module (needed for Socket.IO)
const socketIo = require('socket.io');  // Real-time bidirectional communication library

// Load env vars
dotenv.config();

// Import routes  Each file contains route definitions (GET, POST, PUT, DELETE)
const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');
const userRoutes = require('./routes/userRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

const app = express();  // This app object handles all HTTP requests,,, it contain middleware and routes
const server = http.createServer(app);  // Create HTTP Server with Socket.IO
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json()); // Parses incoming JSON request bodies

// Routes,,, Connects route files to specific URL paths. 
app.use('/api/auth', authRoutes);  // POST /api/auth/login -> handled by authRoutes
app.use('/api/books', bookRoutes);  // GET /api/books
app.use('/api/users', userRoutes); // GET /api/users/:id
app.use('/api/transactions', transactionRoutes); // POST /api/transactions

// Health check ,, Creates a simple endpoint to check if the server is running.
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
}); // example curl http://localhost:5000/health

// Socket.IO connection
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

module.exports = server;