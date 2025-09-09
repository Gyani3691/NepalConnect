const express = require('express');
const Gun = require('gun');
const cors = require('cors');
const path = require('path');

const app = express();

// Enable CORS for all routes with WebSocket support
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true
}));

// Security headers
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// Parse JSON bodies
app.use(express.json());

// Serve Gun.js
app.use(Gun.serve);

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

// Handle SPA routing - always return index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const port = process.env.PORT || 8765;
const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

// Enable WebSocket keepalive
server.keepAliveTimeout = 65000;
server.headersTimeout = 66000;

// Initialize Gun.js with the server
const gun = Gun({
    web: server,
    file: false,
    multicast: false,
    axe: false,
    memory: true,
    peers: [],
    retry: 1000,
    workers: 1
});
