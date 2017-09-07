// making connection
var socket = io.connect("http://localhost:8080");


var message = $("#message");
var handle = localStorage.getItem("username");
var btn = $("#sendBtn");
var output = $("#output");
var feedback = $("#feedback");
// Emit Events

btn.click(function(){
  socket.emit("chat",{
    message: message.val(),
    handle: handle
  });
});

message.keypress(function(){
  socket.emit("typing", handle);
  $("#chat-window").show();
});


socket.on("chat", function(data){
  feedback.html("");
  output.before("<p><strong>" + data.handle + ":</strong>" + data.message + "</p>");
});

socket.on("typing", function(data){
  feedback.html("<p><em>" + data + " is typing...</em></p>");
});

function closeChatWindow(){
	$("#chat-window").hide();
}