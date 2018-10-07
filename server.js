var express = require('express');
var app = express(); 
var server = require('http').createServer(app); 
var io = require('socket.io')(server);
var mariadb = require('mariadb'); 
const pool = mariadb.createPool({host: 'localhost', user: 'root', password: 'makerspace', connectionLimit: 5, database: 'makerspace'}); 
const mfrc522 = require("./index.js"); 
mfrc522.initWiringPi(0); 

app.use(express.static(__dirname + '/public')); 

app.get('/', function(req, res, next){
res.sendFile(__dirname + '/public/index.html');
});



io.on('connect', function(socket){
console.log("Client connected"); 

setInterval(function(){
	mfrc522.reset(); 


let response = mfrc522.findCard(); 

if(!response.status){
console.log("No Card");
return; 
}


response = mfrc522.getUid();
if(!response.status){
console.log("UID Scan Error"); 
return; 
}
const uid = response.data;
const id = uid[0].toString(16) + uid[1].toString(16) + uid[2].toString(16) +uid[3].toString(16);

if(uid !== null) {
pool.getConnection()
	.then(conn => {
	conn.query("SELECT f_name from users where UID = ?", [id])
	.then((res) => {
	console.log(res[0].f_name); 
	conn.end(); 
	})
	.catch(err=>{
	console.log("Error: " + err);  
})

});
}
 
socket.emit('UID', uid[0].toString(16) + uid[1].toString(16) + uid[2].toString(16) +uid[3].toString(16)); 
//console.log(uid[0].toString(16));  

mfrc522.stopCrypto();




},500); 



});

server.listen(3000, function(){
console.log("Listening on port 3000");
});



