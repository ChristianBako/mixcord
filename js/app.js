//Adding the dependincies. 
var express = require("express");
var bodyParser = require("body-parser");
var http = require('http');
var app = express();

//Setting the working directory
app.use(express.static(".."));
//Setting up the parsers for the JSON files we're going to get
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.get()

//These two functions Render using a generic render function contained in the modules
//It takes the abbreviated webpages and sends them back to be put into a div
//Give the server a port to lsten on and a console output so we know what the server is doing. 
app.listen(8080,function(){
	console.log("Running");
});