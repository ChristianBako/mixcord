//Adding the dependincies. 
var express = require('express')
var app = express();
var http = require('http');
var server = http.createServer(app);
var io = require('socket.io').listen(server);

//Give the server a port to lsten on and a console output so we know what the server is doing. 
server.listen(8080,function(){
	console.log("Running");
});
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

// usernames
var users = {};
// rooms 
var rooms = [];

//Socket chatrooms
io.sockets.on('connection', function (socket) {

	// when the client emits 'adduser', this listens and executes
	socket.on('adduser', function(username){
		// store the username in the socket session for this client
		socket.username = username;
		// store the room name in the socket session for this client
		// socket.room = 'room1';
		// add the client's username to the global list
		users[username] = username;
		// send client to room
		// socket.emit('joinroom', username);
	});
	socket.on('addroom', function(roomname) {
		//Roomname for socket client
		socket.room = roomname;
		//Roomname for global list
		rooms.push(roomname);
		socket.join(roomname);
		socket.emit('updatechat', 'SERVER', 'you have connected to ' + roomname);
		socket.broadcast.to(roomname).emit('updatechat', 'SERVER', socket.username + "Connected");
		socket.emit('updaterooms', rooms, roomname);
	});

	// when the client emits 'sendchat', this listens and executes
	socket.on('sendchat', function (data) {
		// we tell the client to execute 'updatechat' with 2 parameters
		io.sockets.in(socket.room).emit('updatechat', socket.username, data);
	});

	socket.on('switchRoom', function(newroom){
		// leave the current room (stored in session)
		socket.leave(socket.room);
		// join new room, received as function parameter
		socket.join(newroom);
		socket.emit('updatechat', 'SERVER', 'you have connected to '+ newroom);
		// sent message to OLD room
		socket.broadcast.to(socket.room).emit('updatechat', 'SERVER', socket.username+' has left this room');
		// update socket session room title
		socket.room = newroom;
		socket.broadcast.to(newroom).emit('updatechat', 'SERVER', socket.username+' has joined this room');
		socket.emit('updaterooms', rooms, newroom);
	});

	// when the user disconnects.. perform this
	socket.on('disconnect', function(){
		// remove the username from global usernames list
		delete users[socket.username];
		// update list of users in chat, client-side
		// echo globally that this client has left
		socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');
		socket.leave(socket.room);
	});
});