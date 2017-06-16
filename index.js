"use strict";

const express = require('express');
const app = express();

// Run server to listen on port 3000.
const server = app.listen(process.env.PORT || 3000, () => {
  console.log('listening on *:3000');
});

const io = require('socket.io')(server);

app.use(express.static('static'));
var player = 0;
var messages = [];
// Set socket.io listeners.
io.on('connection', (socket) => {

  console.log('a new user connected');
  io.emit('signed on', { player });
  player = player + 1;
  io.emit('messages update', { messages });
  console.log(player);
	socket.on('click', function(data) {
		io.emit('click move', { data });	
	});
	socket.on('reset', function(data) {
		io.emit('reset move', { data });	
	});
	socket.on('name change', function(data) {
		io.emit('naming change', { data });	
	});
	socket.on('message sent', function(data) {
		var arr=[data['name'], data['message']];
		messages.push(arr);
		io.emit('messages update', { messages });	
	});
  socket.on('disconnect', () => {
    console.log('user disconnected');
	player = player - 1;
	if(player === 0){
		messages = [];
	}
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
