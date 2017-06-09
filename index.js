"use strict";

const express = require('express');
const app = express();

// Run server to listen on port 3000.
const server = app.listen(process.env.PORT || 3000, () => {
  console.log('listening on *:3000');
});

const io = require('socket.io')(server);

app.use(express.static('static'));

// Set socket.io listeners.
io.on('connection', (socket) => {
  console.log('a new user connected');

	socket.on('click', function(data) {
		io.emit('click move', { data });	
	});
	socket.on('reset', function(data) {
		io.emit('reset move', { data });	
	});
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

io.on('click', (socket) => {
  console.log('click');
});

// Set Express routes.
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

app.get('/css', (req, res) => {
  res.sendFile(__dirname + '/views/App.css');
});


// Test route for socket events.
app.get('/test', (req, res) => {
  io.emit('test', { 'Hello': 'World' });
  res.send('Hello Socket.io :)');
});
