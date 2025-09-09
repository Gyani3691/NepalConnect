const express = require('express');
const Gun = require('gun');
const cors = require('cors');
const path = require('path');

const app = express();

// Basic security middleware
app.use((req, res, next) => {
    res.header('X-Frame-Options', 'DENY');
    res.header('X-Content-Type-Options', 'nosniff');
    res.header('Referrer-Policy', 'no-referrer');
    next();
});

// Enable CORS
app.use(cors());

// Parse JSON and serve static files
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

// Serve Gun.js
app.use(Gun.serve);

// Health checks
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.get('/gun/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Handle SPA routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start server
const port = process.env.PORT || 8765;
const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

// Configure server timeouts
server.keepAliveTimeout = 65000;
server.headersTimeout = 66000;

// Initialize Gun
const gun = Gun({
    web: server,
    file: false,
    multicast: false,
    memory: true,
    peers: [],
    retry: 500,
    max: Infinity
});

// Monitor connections
gun.on('hi', peer => {
    console.log(`Peer connected: ${peer}`);
});

gun.on('bye', peer => {
    console.log(`Peer disconnected: ${peer}`);
});

// Export for potential use in other parts of the application
module.exports = { app, gun };
