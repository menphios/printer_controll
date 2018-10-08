var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var mariadb = require('mariadb');
var debug = require('debug');
var EventEmitter = require('events').EventEmitter;
var system = new EventEmitter();
const pool = mariadb.createPool({host: 'localhost', user: 'root', password: 'makerspace', connectionLimit: 5, database: 'makerspace'});

//Webserveren bruker filene som ligger i public, html/css o.l.
app.use(express.static(__dirname + '/public'));

//Når en klient går inn på webserveren sendes index.html,
//Enten dette er ip-adresse:port eller en web-adresse (DNS)
app.get('/', function(req, res, next){
res.sendFile(__dirname + '/public/index.html');
});

//Når en klient har koblet seg til webserveren skjer dette:
io.on('connect', function(socket){
console.log("Client connected");

//Når rfid-en har lest av en verdi sendes UID ut på hele systemet:
//I server.js betyr det at den skal sende dette til nettsiden i dette tilfellet:
	system.on('UID', function(data){
		socket.emit('UID', data);
	});

});

//Serveren starter på port 3000 og IP-adressen til RPI-en:
server.listen(3000, function(){
console.log("Listening on port 3000");
});
