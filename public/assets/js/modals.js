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

                    var userBtn = $("<button class='btn btn-md btn-danger' style='margin:1em'>");
                    userBtn.append(users[t].name);
                    userBtn.attr('id', users[t].id);
                    $("#ex1").children("div").append(userBtn);
                    noUsers = false;
                }

            }

            if (noUsers) {
                $("#ex1").children("div").html("<h1 style='color:black'> No unique users to add! </h1>");
            } else {
                $("#ex1").children("div").prepend("<span style='color:black'>Users not in board:</span>")
            };
        });
    });
});

$(document).on("click", ".btn.btn-md.btn-danger", function() {

    var userId = parseInt($(this).attr('id'));
    // console.log($(this).attr('id'));
    // console.log(BoardId);
    // alert("Added to board!")

    $(this).removeClass("btn-danger").addClass("btn-success");

    setTimeout(function(){$(".btn-success").remove()},750);

    $.get("/api/boards/" + BoardId + "/users/" + userId, function(data) {
        console.log(data);
    });
});