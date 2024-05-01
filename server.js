
const http = require("http");
const express = require("express");
// const path = require("path");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// const io = require('socket.io')(8000, {
//     cors: {
//         origin: "*"
//     }
// });

const users = {};

io.on('connection', socket => {
    // Event: new user joins
    socket.on('new-user-joined', name => {
        // Storing the user's name based on their socket ID
        users[socket.id] = name;
        // Emitting a message to all other users that a new user has joined
        socket.broadcast.emit('user-joined', name);
    });

    // Event: user sends a message
    socket.on('send', message => {
        // Broadcasting the message to all other users except the sender
        socket.broadcast.emit('receive', { message: message, name: users[socket.id] });
    });

    // Event: user disconnects
    socket.on('disconnect', () => {
        // Broadcasting a message to all other users that this user has left
        socket.broadcast.emit('leave', users[socket.id]);
        // Removing the user from the users object
        delete users[socket.id];
    });
});

app.use(express.static('public'));

app.get("/", (req, res) => {
  // return res.sendFile(path.join(__dirname, "public", "index.html"));
  res.sendFile("index.html", { root: __dirname });
});

server.listen(9000, () => console.log(`Server Started at PORT:9000`));
