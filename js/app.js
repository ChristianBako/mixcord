//Adding the dependincies. 
var express = require("express");
var bodyParser = require("body-parser");
var http = require('http');
var app = express();


function HTMLrender(FILENAME){
	var html = fs.readFileSync(FILENAME, "utf-8");
	return html;
}

//Setting the working directory
app.use(express.static(".."));
//Setting up the parsers for the JSON files we're going to get
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


app.get('/login',function(req,res){
	console.log("login requested")
	res.send(HTMLrender("../login.html"))
});

app.get('/chatroom',function(req,res){
	console.log("login requested")
	res.send(HTMLrender("../login.html"))
});

app.get('/mainmenu',function(req,res){
	console.log("MainMenu Req")
	res.send(HTMLrender("../mainmenu.html"))
});




//These two functions Render using a generic render function contained in the modules
//It takes the abbreviated webpages and sends them back to be put into a div
//Give the server a port to lsten on and a console output so we know what the server is doing. 
app.listen(8080,function(){
	console.log("Running");
});