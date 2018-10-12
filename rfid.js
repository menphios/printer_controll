var debug = require("debug")("rfid");
var util = require('util');
const mfrc522 = require("./node_modules/mfrc522-rpi/index.js");
mfrc522.initWiringPi(0); //Kobler opp RFID-leseren på SPI-pinnene

//En ny rfid starter opp i det serveren starter;
exports = module.exports = function(system) {
  debug("new(rfid)");
  return new rfid(system);
}

function rfid(system) {
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

    /*Teste ut SELECT f_name, l_name, studentid from users where UID = ?, [id], når databasen er oppe å går.
    Det vil da bli at man skriver: system.emit('UID', f_name, l_name, studentid) og sender dette til server.js. 
    */
/*
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
    */
  	//Serveren sender meldingen UID, med verdiene:
  	system.emit('UID', uid[0].toString(16) + uid[1].toString(16) + uid[2].toString(16) +uid[3].toString(16));
  	mfrc522.stopCrypto();
  },500);
}
