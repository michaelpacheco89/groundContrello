// event listener to add user to board

var tasksUsersObj = {};

$(document).ready(function() {
    $.get("/api/tasks", function(tasks) {
        for (var t = 0; t < tasks.length; t++) {
            tasksUsersObj[t + 1] = tasks[t].Users;
        }
        console.log(tasksUsersObj);
        populateBoard(tasksUsersObj);
    });
});

$(document).on("click", ".addUser", function() {
    // CREATE FORM TO SUBMIT USER (AUTO COMPLETION)
    // var form = $("<form id='addUserForm'>");
    // var input = $("<input id='#newUser'>");
    // var submitBtn = $("<button type='submit' class='btn btn-sm btn-success'>");
    // form.append(input, submitBtn,"BLAM");
    // $("#ex1").children("p").append(form);
    var userBtn = $("<button class='btn btn-md btn-danger'>");
    $("#ex1").children("div").append(userBtn);

    // console.log("TEST!");
    // (drop down from + sign)
    //console.log($('#newUser').val().trim());
    ///api/boards/:id/users/:userId
});

$(document).on("submit", "#addUserForm", function() {

});