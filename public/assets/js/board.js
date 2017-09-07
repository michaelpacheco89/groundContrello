// making socket connection
var socket = io.connect();

// to keep track of the number of lists on the page for index purposes
var numLists;
// id to get the correct lists for the board
var BoardId = localStorage.getItem('BoardId');

$("form").submit(function(event) {
    event.preventDefault();
});

// event listener to submit nearest form when enter key pressed while focused on input
$("input.editInput").keypress(function(event) {
    if (event.which == 13) {
        event.preventDefault();
        $("form").submit();
    }
});

// event listener to submit edit on focus out. if empty, restore to original value
function submitOnFocusOut(input) {
    if (!$(input).val()) {
        $(input).val($(input).attr('value'));
    }
    $(input).parent().submit();
}

// event listener to edit title of lists and lists
$(document).on("click", ".list-header, .card-detail", function() {
    var placeholder = $(this).text();
    var editForm = $("<form>");
    var listIdInput = $("<input type='hidden' name='id'>");
    var editInput = $("<input type='text' class='editInput' value='" + placeholder + "' onfocusout='submitOnFocusOut(this)'>").val(placeholder);
    editInput.attr('name', 'text');
    if ($(this).hasClass("list-header")) {
        editForm.attr('class', 'editListForm');
        listIdInput.attr('value', $(this).parent().attr('id'));
    } else {
        editForm.attr('class', 'editTaskForm');
        listIdInput.attr('value', $(this).attr('id'));
    }
    editForm.append(listIdInput, editInput);
    $(this).replaceWith(editForm);
    $(".editInput").focus().select();
});

// event listeners to return the list/task body back from input to text
$(document).on("submit", ".editListForm, .editTaskForm", function(event) {
    event.preventDefault();
    var $form = $(this);
    var queryString;
    var editObject = {
        id: $form.find("input[name='id']").val()
    };
    var newContent;
    if (!$form.find("input[name='text']").val()) {
        $form.find("input[name='text']").val($form.find("input[name='text']").attr('value'));
    }
    if ($form.hasClass("editListForm")) {
        newContent = $("<h6 class='list-header'>");
        editObject.title = $form.find("input[name='text']").val();
        queryString = "/api/lists";
    } else {
        newContent = $("<p class='card-detail ui-state-default'>");
        newContent.attr('id', $form.find("input[name='id']").val());
        newContent.append(
            "<i class='fa fa-times deleteTask' aria-hidden='true' style='position: relative;float: right;'></i>");
        editObject.body = $form.find("input[name='text']").val();
        queryString = "/api/tasks";
    }
    newContent.prepend($form.find("input[name='text']").val());
    $.ajax({
        method: "PUT",
        url: queryString,
        data: editObject
    }).done(function() {
        $form.replaceWith(newContent);
    });
});

// populate the page with the right lists in the right order on load

$(document).ready(function() {
    //NEW CODE
    var tasksUsersObj = {};
    $.get("/api/tasks", function(tasks) {
        for (var t = 0; t < tasks.length; t++) {
            tasksUsersObj[t + 1] = tasks[t].Users;
        }
        
    });
    console.log(tasksUsersObj)
    //END CODE

    $.get("/api/lists?BoardId=" + BoardId, function(data) {
        numLists = data.length;
        var lists = [];
        lists.length = numLists;
        for (i = 0; i < numLists; i++) {
            var newList = $("<div class='card-wrap'>");
            newList.attr('id', data[i].id);
            var header = $("<h6 class='list-header'>");
            header.text(data[i].title);
            var remove = $("<i class='fa fa-times deleteList' aria-hidden='true' style='position: relative;float: right;top:4px;right:8px;'></i>");
            var content = $("<div  class='list-cards'>");
            var tasks = [];
            tasks.length = data[i].Tasks.length;
            for (j = 0; j < tasks.length; j++) {
                var cardDetail = $("<p class='card-detail ui-state-default'>");
                cardDetail.attr('id', data[i].Tasks[j].id);
                cardDetail.html(data[i].Tasks[j].body +
                    "<i class='fa fa-times deleteTask' aria-hidden='true' style='position: relative;float: right;top:2px;'></i><br>");
                

                //MORE CODE

                var taskId = data[i].Tasks[j].id;

                for (var u = 0; u < tasksUsersObj[taskId].length; u++) {
                    //console.log(j + ": " + tasksUsersObj[j][u].name);
                    cardDetail.append(tasksUsersObj[taskId][u].name);
                }
                //END MORE

                tasks[data[i].Tasks[j].index] = cardDetail;
            }
            for (j = 0; j < tasks.length; j++) {
                content.append(tasks[j]);
            }
            var addCard = $("<a class='addCardLink' href='#'>").text("Add a card...");

            newList.append(remove, header, content, addCard);
            $(content).sortable({
                connectWith: ".list-cards",
                placeholder: "ui-sortable-placeholder-cards",
                start: function(e, ui) {
                    ui.placeholder.height(ui.helper.outerHeight());
                    ui.placeholder.width(ui.helper.outerWidth());
                },
                update: function(e, ui) {
                    var dataTask = $(this).sortable('toArray');
                    var ListId = $(this).parent().attr('id');
                    console.log(dataTask);
                    console.log(ListId);
                    $.post("/api/tasks/update?ListId=" + ListId, { data: dataTask });
                },
                helper: 'clone'
            });
            lists[parseInt(data[i].index)] = newList;
        }
        for (i = 0; i < numLists; i++) {
            $("#lists").append(lists[i]);
        }
    });
});

// helper to replace form with link on blur of add card form
function addCardOnBlur(input) {
    if (!$(input).siblings("button.makingNewCard").attr("mouseDown") && !$(input).siblings(".closeAddCard").attr("mouseDown")) {
        var addCard = $("<a class='addCardLink' href='#'>").text("Add a card...");
        addCard.attr('value', $(input).val());
        $(input).parent().replaceWith(addCard);
    }
}

// event listener to replace add a card link with form
$(document).on("click", ".addCardLink", function() {
    var form = $("<form class='addCard'>");
    var input = $("<input class='newCard editInput' style='width:100%;border-radius:3px;display:block;border:none;' onblur='addCardOnBlur(this)'>");
    var button = $("<button type='submit' class='btn btn-sm btn-success makingNewCard'>Add</button>");
    var remove = $("<i class='fa fa-times closeAddCard' aria-hidden='true' style='position: relative;top:2px;'></i>");
    if ($(this).attr('value')) {
        input.val($(this).attr('value'));
    }
    form.append(input, button, remove);
    $(this).replaceWith(form);
    $(".newCard").focus().select();
});

// to prevent loss of focus behavior upon clicking x or add buttons
$(document).on("mousedown", ".makingNewCard, .closeAddCard", function(e) {
    $(this).attr("mouseDown", true);
});

$(document).on("mouseup", ".makingNewCard, .closeAddCard", function(e) {
    $(this).attr("mouseDown", false);
});

// helper to replace form with link on blur of add list form
function addListOnBlur(input) {
    if (!$(input).siblings("button").attr("mouseDown") && !$(input).siblings(".closeAddList").attr("mouseDown")) {
        var addListSpan = $("<span>").text("Add a list...");
        addListSpan.attr('value', $(input).val());
        $(input).parent().parent().html(addListSpan);
    }
}

// event listener to replace add a list span with form
$(document).on("click", "#addList span", function() {
    var wrapper = $("<div id='addListWrapper'>");
    var titleInput = $("<input type='text' class='editInput' id='title' placeholder='Add a list...' style='width:100%;border-radius:3px;display:block;border:none;padding:8px;font-size:14px;' onblur='addListOnBlur(this)'>");
    if ($(this).attr('value'))
        titleInput.val($(this).attr('value'));
    var button = $("<button class='btn btn-sm btn-success' type='submit' id='newList'>").text('Save');
    var closeBtn = $('<i class="fa fa-times closeAddList" aria-hidden="true" style="position:relative;top:2px;">');
    wrapper.append(titleInput, button, closeBtn);
    $(this).replaceWith(wrapper);
    $("#title").focus().select();
});

// to prevent loss of focus behavior upon clicking x or add buttons
$(document).on("mousedown", "#newList, .closeAddList", function(e) {
    $(this).attr("mouseDown", true);
});

$(document).on("mouseup", "#newList, .closeAddList", function(e) {
    $(this).attr("mouseDown", false);
});

// allowing for sorting of list order
$("#lists").sortable({
    placeholder: "ui-sortable-placeholder-lists",
    start: function(e, ui) {
        ui.placeholder.height(ui.helper.outerHeight());
    },
    tolerance: 'pointer',
    update: function(event, ui) {
        var data = $(this).sortable('toArray');
        console.log(data);
        $.post("/api/lists/update", { data: data });
    },
    helper: 'clone'
});

var addList = $("#addList");

// event listener to create new list IN REAL TIME
socket.on("list", function(data) {
    // console.log(data);
    numLists++;
    var list = $("<div class='card-wrap'>");
    list.attr('id', data.id);
    var remove = $("<i class='fa fa-times deleteList' aria-hidden='true' style='position: relative;float: right;top:4px;right:8px;'></i>");
    var header = $("<h6 class='list-header'>");
    header.text(data.title);

    var content = $("<div  class='list-cards'>");

    var addCard = $("<a class='addCardLink'>").text("Add a card...");
    list.append(remove, header, content, addCard);
    // making the list of tasks sortable
    $(content).sortable({
        connectWith: ".list-cards",
        placeholder: "ui-sortable-placeholder-cards",
        start: function(e, ui) {
            ui.placeholder.height(ui.helper.outerHeight());
            ui.placeholder.width(ui.helper.outerWidth());
        },
        update: function(e, ui) {
            var data = $(this).sortable('toArray');
            var ListId = $(this).parent().attr('id');
            $.post("/api/tasks/update?ListId=" + ListId, { data: data });
        },
        helper: 'clone'
    });
    $("#lists").append(list);
    // clear input data
    $("#title").val("");
});

$(addList).on("submit", function(event) {
    event.preventDefault();
    var newListTitle = $("#title");
    if (!newListTitle.val().trim()) {
        return;
    }
    var addListSpan = $("<span>").text("Add a list...");
    addList.html(addListSpan);
    $.post("/api/lists", {
        title: newListTitle.val().trim(),
        index: numLists,
        BoardId: BoardId
    }, function(data) {
        socket.emit("list", data);
    });
});

// event listener for making new task
$(document).on("click", ".makingNewCard", function(event) {
    event.preventDefault();
    var newCard = $(this).parent();
    if (!newCard.children("input.newCard").val().trim()) {
        return;
    }
    var numCards = $(this).parent().parent().children("div.list-cards").children().length;
    var parent = $(this).parent().parent().children("div.list-cards");

    $.post("/api/tasks", {
        body: newCard.children("input.newCard").val().trim(),
        index: numCards,
        ListId: parent.parent().attr('id')
    }, function(data) {

        var cardDetail = $("<p class='card-detail ui-state-default'>");
        cardDetail.attr('id', data.id);
        cardDetail.html(newCard.children("input.newCard").val().trim() +
            "<i class='fa fa-times deleteTask' aria-hidden='true' style='position: relative;float: right;top:2px;'></i>");
        parent.append(cardDetail);
        newCard.children("input.newCard").val('');
    });
});

// event listener to sign out
$(document).on("click", ".sign-out", function() {
    document.cookie = "userId=''; expires=Thu, 18 Dec 2002 12:00:00 UTC; path=/";
    window.location.href = "/login";
});

// event listener to add user to board
$(document).on("click", ".addUser", function() {
    //console.log($('#newUser').val().trim());
    var newUser = $('#newUser').val().trim();

    if (newUser === "") {
        alert("User cannot be blank!");
    } else {
        //console.log("Success!");

        $.get("api/users/n?name=" + newUser, function(user) {
            console.log(user);
            $.get("api/boards/" + parseInt(localStorage.getItem("BoardId")) + "/users/" + user.id, function(data) {
                console.log(data);
                $('#newUser').val("");
            });
        });


        /*$.post("api/boards/" +  + "/users/" + , function(data) {
            console.log(data);
            $('#newUser').val() = "";
        });*/
    }

    ///api/boards/:id/users/:userId
});

// event listeners to delete a list or task card upon clicking the x IN REAL TIME
// socket.on("deleteList",function(result){
//   var test = "#" + id;
//   console.log(result);
//   $(".card-wrap").remove(test);
//   var data = listEdited.sortable("toArray");
//   $.post("/api/lists/update", { data: data });
// });

$(document).on("click", ".deleteList", function() {
    var id = $(this).parent().attr('id');
    var listEdited = $(this).parent().parent();
    $.ajax({
        method: "DELETE",
        url: "/api/lists/" + id
    }).done(function(result) {
        var test = "#" + id;
        console.log(result);
        $(".card-wrap").remove(test);
        var data = listEdited.sortable("toArray");
        $.post("/api/lists/update", { data: data });
    });
});

$(document).on("click", ".deleteTask", function(event) {
    event.stopPropagation();
    var id = $(this).parent().attr('id');
    var listEdited = $(this).parent().parent();
    var ListId = $(this).parent().parent().parent().attr('id');
    $.ajax({
        method: "DELETE",
        url: "/api/tasks/" + id
    }).done(function(result) {
        var test = "#" + id;
        console.log(result);
        $(".card-detail").remove(test);
        var data = listEdited.sortable("toArray");
        $.post("/api/tasks/update?ListId=" + ListId, { data: data });
    });
});

$(document).on("click", ".closeAddCard", function(event) {
    event.stopPropagation();
    var addCard = $("<a class='addCardLink' href='#'>").text("Add a card...");
    $(this).parent().replaceWith(addCard);
});

$(document).on("click", ".closeAddList", function(event) {
    event.stopPropagation();
    var addListSpan = $("<span>").text("Add a list...");
    addList.html(addListSpan);
});



// =======

/*/*/
/*/*$(addList).on("submit", function(event) {
    event.preventDefault();
    // console.log("are you working?");
    if (!newListTitle.val().trim()) {
        return;
    }

    list = $("<div class='card-wrap'>");
    var header = $("<div class='list-header'>");
    header.text(newListTitle.val().trim());

    var content = $("<div class='list-cards'>");

    // var addCard = $("<a> Add a card </a>");

    var form = $("<form class='addCard'>");
    var input = $("<input class='newCard'>");
    var button = $("<button type='submit' class='makingNewCard'>Add new card</button>");

    form.append(input, button);
    list.append(header, content, form);
    /*$("#lists").prepend(list);*/

// //console.log(newListTitle,newListTitle.val().trim());
// createList({
//     title: newListTitle.val().trim(),
//     BoardId: parseInt(localStorage.getItem("board"))
// });

// clear input data
/* $("#title").val(" ");
});

$(document).on("click", ".makingNewCard", function(event) {
    event.preventDefault();
    var newCard = $(".newCard");

    if (!newCard.val().trim()) {
        return;
    }

    var cardDetail = $("<div class='card-detail'>");
    cardDetail.text(newCard.val().trim());
    list.append(cardDetail);

    // createTask({
    //     body: newCard.val().trim(),
    //     ListId: parseInt(localStorage.getItem("list"))
    // });

    // clear input datas
    $(".newCard").val("");
});

function createTask(task) {
    $.post("/api/tasks", task, function(data) {
        console.log(data);
        localStorage.setItem('task', data.id);
    });
}

function createList(list) {
    $.post("/api/lists", list, function(data) {
        console.log(data);
        localStorage.setItem('list', data.id);
    });
}*/
/*/*/
// >>>>>>> 35c58c8dc179a5a6a64d3984be8b6934a6c68b9e