// event listener to add user to board
var BoardId = parseInt(localStorage.getItem('BoardId'));
var boardUsersArr = [];
var noUsers = true;

$(document).ready(function() {
    $.get("/api/users", function(users) {

        $.get("/api/boards/" + BoardId, function(boardUsers) {
            for (var b = 0; b < boardUsers.Users.length; b++) {
                boardUsersArr.push(boardUsers.Users[b].id);
            }
            //console.log(boardUsersArr)

            for (var t = 0; t < users.length; t++) {

                //console.log(users[t].id)
                if (boardUsersArr.indexOf(users[t].id) === -1) {

                    var userBtn = $("<button class='btn btn-md btn-danger user' style='margin:1em'>");
                    userBtn.append(users[t].name);
                    userBtn.attr('id', users[t].id);
                    $("#ex1").children("div").append(userBtn);
                    noUsers = false;
                }

            }

            if (noUsers) {
                $("#ex1").children("div").html("<h1 style='color:black'> No unique users to add! </h1>");
            } else {
                $("#ex1").children("div").prepend("<span style='color:black'>Users not in board:</span>");
            }
        });
    });
});

$(document).on("click", ".btn.btn-md.btn-danger", function() {

    var userId = parseInt($(this).attr('id'));
    // console.log($(this).attr('id'));
    // console.log(BoardId);
    // alert("Added to board!")

    $(this).removeClass("btn-danger").addClass("btn-success");

    setTimeout(function() { $(".btn-success.user").remove(); }, 750);

    $.get("/api/boards/" + BoardId + "/users/" + userId, function(data) {
        console.log(data);
    });
});

$(document).on("click", ".assignTask", function() {
    $("#ex2").children("div").text("");
    var taskUsersArr = [];
    noUsers = true;
    //alert($(this).parent().attr('id'))
    var taskId = parseInt($(this).parent().attr('id'));

    $.get("/api/tasks/" + taskId, function(taskUsers) {

        for (var i = 0; i < taskUsers.Users.length; i++) {
            taskUsersArr.push(taskUsers.Users[i].id);
        }

        //console.log("TASK USERS", taskUsersArr);

        $.get("/api/boards/" + BoardId, function(boardUsers) {
            for (var b = 0; b < boardUsers.Users.length; b++) {

                var userBtn = $("<button class='btn btn-md btn-success task' style='margin:1em'>");
                userBtn.append(boardUsers.Users[b].name);
                userBtn.attr('id', boardUsers.Users[b].id);
                userBtn.attr('taskId',taskId);

                if (boardUsersArr.indexOf(boardUsers.Users[b].id) === -1) {

                    boardUsersArr.push(boardUsers.Users[b].id);

                }

                if(taskUsersArr.indexOf(boardUsers.Users[b].id) === -1){
                    $("#ex2").children("div").append(userBtn);
                    noUsers = false;
                }

            }

            if (noUsers) {
                $("#ex2").children("div").html("<h1 style='color:black'> All board members have been added! </h1>");
            } else {
                $("#ex2").children("div").prepend("<span style='color:black'>Users available for task:</span>")
            };

            $('#ex2').modal('show');
        });
    });


});

$(document).on("click", ".btn-success.task", function() {

    console.log($(this).attr('id'));

    var userId = parseInt($(this).attr('id'));
    var taskId = parseInt($(this).attr('taskId'));

    $(this).removeClass("btn-success").addClass("btn-warning");

    setTimeout(function() { $(".btn-warning").remove() }, 750);

    $.get("/api/tasks/" + taskId + "/users/" + userId, function(data) {
        console.log(data);
    });

});

$(document).on("click", "#ex2 a", function() {

    window.location.reload();

});




// $('.assignTask').click(function(event) {
//   event.preventDefault();
//   $.get(this.href, function(html) {
//     $(html).appendTo('body').modal();
//   });
// });
