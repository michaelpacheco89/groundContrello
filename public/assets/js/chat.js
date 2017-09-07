var message = $("#message");
var handle = localStorage.getItem("username");
var btn = $("#sendBtn");
var output = $("#output");
var feedback = $("#feedback");
// Emit Events

$(document).ready(function() {

// when clicked it will send message..
$("#chatForm").submit(function(e) {
  e.preventDefault();

  socket.emit("chat", {
    message: message.val(),
    handle: handle
  });
  //clears input field after you send msg
  message.val("");
  return false;
});
  // will emit a " 'user' is typing" msg to everyone except the typer
  message.keypress(function() {
    socket.emit("typing", handle);
  });

message.keypress(function(){
  socket.emit("typing", handle);
  $("#chat-window").show();
});

  socket.on("chat", function(data) {
    feedback.html("");
    output.before("<p><strong>" + data.handle + ":</strong>" + data.message + "</p>");
  });

  socket.on("typing", function(data) {
    feedback.html("<p><em>" + data + " is typing...</em></p>");

  });

});

function closeChatWindow(){
	$("#chat-window").hide();
}