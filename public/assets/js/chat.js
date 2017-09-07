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
$("#message").focus(function(){
	$("#chat-window").show();
});

message.keypress(function(){
	  $("#chat-window").show();
  socket.emit("typing", handle);
// <<<<<<< HEAD

// =======
//   $("#chat-window").show();
// >>>>>>> b49f7511e0af130db98fdbc704a00c1394d62b77
});

  socket.on("chat", function(data) {
    feedback.html("");
    output.before("<p><strong>" + data.handle + ":</strong>" + data.message + "</p>");
  });

  socket.on("typing", function(data) {
    feedback.html("<p><em>" + data + " is typing...</em></p>");

  });

});


$(document).mousedown('click', function(e) {
	var container = $("#board-chat");
	if(!container.is(e.target)&&container.has(e.target).length === 0){
		$("#chat-window").hide();
	}

});
