const express = require('express');
const Gun = require('gun');
const cors = require('cors');
const path = require('path');

const app = express();

// Enable CORS for all routes
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parse JSON bodies
app.use(express.json());

// Serve Gun.js
app.use(Gun.serve);

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// Handle SPA routing - always return index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const port = process.env.PORT || 8765;
const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

// Initialize Gun.js with the server
const gun = Gun({
    web: server,
    file: false, // Disable file persistence for free tier
    multicast: false,
    axe: false, // Disable experimental features
    memory: true, // Keep data in memory
    peers: [] // Start with no peers - they'll connect to us
});
