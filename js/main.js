//Adding the dependincies. 
var express = require('express')
var app = express();
var http = require('http');
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var fs = require("fs");
function HTMLrender(FILENAME){
	var html = fs.readFileSync(FILENAME, "utf-8");
	return html;
}
app.use(express.static(".."));


//Give the server a port to lsten on and a console output so we know what the server is doing. 
server.listen(8080,function(){
	console.log("Running");
});
app.get('/', function (req, res) {
  res.sendFile('/index.html');
});
app.get('/login',function(req,res){
	console.log("login requested")
	res.send(HTMLrender("../login.html"))
});

app.get('changeAlbum', function(data) {
	console.log("Album change for ROOM requested, URI: " + data.albumid);
});

app.get('/chatroom',function(req,res){
	console.log("chatroom page requested")
	res.send(HTMLrender("../chatroom.html"))
});

app.get('/mainmenu',function(req,res){
	console.log("MainMenu page Req")
	res.send(HTMLrender("../mainmenu.html"))
});
// usernames
var users = {};
// rooms 
var rooms = [];
//Dict for spotify URI's
var roomuri = {};

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
		console.log("user added NAME: " + username);
	});
	socket.on('addroom', function(roomname,uri) {
		//Error checking for URI formatting
		if (uri.split(":")[0]!="spotify") {
			console.log("Not a valid ID");
			socket.emit('updatechat', 'SERVER', 'Your URI  ' + uri + ' is not in a correct format.');
			return -1;
		}

		//Roomname for socket client
		socket.room = roomname;
		//Push uri to dict
		roomuri[roomname] = uri;
		//Roomname for global list
		rooms.push(roomname);
		socket.join(roomname);
		//Debugging and user notification
		socket.emit('updatechat', 'SERVER', 'you have connected to ' + roomname + '\nThe URI for this room is ' + uri);
		socket.broadcast.to(roomname).emit('updatechat', 'SERVER', socket.username + "Connected");
		socket.emit('updaterooms', rooms, roomname);
		io.in(socket.room).emit('updateURI',roomuri[socket.room]);
		console.log("Room added NAME: " + roomname + " URI: " + roomuri[roomname]);
	});

	// when the client emits 'sendchat', this listens and executes
	socket.on('sendchat', function (data) {
		// we tell the client to execute 'updatechat' with 2 parameters
		io.sockets.in(socket.room).emit('updatechat', socket.username, data);
	});

	socket.on('switchRoom', function(newroom){
		console.log(socket.username+" Left " + socket.room + " for " + newroom + " with URI " + roomuri[newroom]);
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
		//Update URI for new room
		socket.emit('updaterooms', rooms, newroom);
		io.in(socket.room).emit('updateURI',roomuri[newroom]);
	});

	socket.on("changeAlbum",function(albumID){
		console.log("Attempting to change ALBUM to " + albumID);
		//Error checking
		if (albumID.split(":")[0]!="spotify") {
			return -1;
			console.log("Not a valid ID");
		}
		//Change dict and send out to the room
		roomuri[socket.room] = albumID;
		socket.broadcast.to(socket.room).emit('updatechat', 'SERVER', socket.username + "Updated album to "+albumID);
		io.in(socket.room).emit('updateURI',roomuri[socket.room]);
		console.log("Changed ALBUM");
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