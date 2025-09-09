const express = require('express');
const Gun = require('gun');
const app = express();

app.use(Gun.serve);
app.use(express.static(__dirname + '/dist'));

const server = app.listen(process.env.PORT || 8765, () => {
    console.log(`Server running on port ${server.address().port}`);
});

// Create gun instance
const gun = Gun({
    web: server,
    file: 'data',
    multicast: false
});
