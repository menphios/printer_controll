$(function () {
  //Starter nye socket-kommunikasjon (TCP/IP mellom server og nettsiden)
  var socket = new io();
  //Når serveren sender en verdi markert med UID, skjer dette:
  socket.on('UID', function(text) {
    if(text = 'd3f3ba0'){
      //Teksten 'Hei Truls' legges på id='test' i html filen:
      $('#test').text('Hei Truls');
      //Dette må testes ut:
      window.location.href = "main_page.html"; 
    }
  });
});
