// making socket connection
var socket = io.connect();
// id to get the correct lists for the board
var BoardId = localStorage.getItem('BoardId');
// javier knows what this is
var tasksUsersObj = {};

///////////////////////////// MISC /////////////////////////////

$("form").submit(function(event) {
    event.preventDefault();
});

// event listener to sign out
$(document).on("click", ".sign-out", function() {
    localStorage.clear();
    document.cookie = "userId=''; expires=Thu, 18 Dec 2002 12:00:00 UTC; path=/";
    window.location.href = "/login";
});

//////////////////////////////////////////////////////////////////////////////////
/////////////////////////// POPULATE DATA ON PAGE LOAD ///////////////////////////
//////////////////////////////////////////////////////////////////////////////////
// populate the page with the right lists in the right order on load

function populateBoard(tasksUsersObj) {
  $.get("/api/lists?BoardId=" + BoardId, function(data) {
      var numLists = data.length;
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

              var taskId = data[i].Tasks[j].id;

              if (tasksUsersObj[taskId] != null) {
                for (var u = 0; u < tasksUsersObj[taskId].length; u++) {
                  cardDetail.append(tasksUsersObj[taskId][u].name);
                }
              }

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
                  $.post("/api/tasks/update?ListId=" + ListId, { data: dataTask }, function() {
                    socket.emit("moveCards", { ListId: ListId});
                  });
              },
              helper: 'clone'
          });
          lists[parseInt(data[i].index)] = newList;
      }
      for (i = 0; i < numLists; i++) {
          $("#lists").append(lists[i]);
      }
  });
}

$(document).ready(function() {
    $.get("/api/tasks", function(tasks) {
        for (var t = 0; t < tasks.length; t++) {
            tasksUsersObj[t + 1] = tasks[t].Users;
        }
        console.log(tasksUsersObj);
        populateBoard(tasksUsersObj);
    });
});

//////////////////////////// MAKE LISTS SORTABLE ////////////////////////////////

$("#lists").sortable({
    placeholder: "ui-sortable-placeholder-lists",
    start: function(e, ui) {
        ui.placeholder.height(ui.helper.outerHeight());
        ui.item.startPos = ui.item.index();
    },
    tolerance: 'pointer',
    update: function(event, ui) {
        var data = $(this).sortable('toArray');
        console.log(data);
        var ListId2 = $($("#lists").children()[ui.item.startPos]).attr('id');
        $.post("/api/lists/update", { data: data }, function() {
          socket.emit("moveLists");
        });
    },
    helper: 'clone'
});

//////////////////////////////////////////////////////////////////////////////////
/////////////////////////// EDITING TASKS/LISTS //////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
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
            "<i class='fa fa-times deleteTask' aria-hidden='true' style='position: relative;float: right;top:2px;'></i>");
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

// actual socket function to update orders of task cards
socket.on('moveCard', function(data) {
    console.log(data);
    $.get("/api/tasks?ListId="+data.ListId, function(tasks) {
      console.log(tasks);
      $("div#"+data.ListId+".card-wrap").children("div.list-cards").html('');
      var taskArr = [];
      taskArr.length = tasks.length;
      for(i=0;i<tasks.length;i++) {
        var cardDetail = $("<p class='card-detail ui-state-default'>");
        cardDetail.attr('id', tasks[i].id);
        cardDetail.html(tasks[i].body +
            "<i class='fa fa-times deleteTask' aria-hidden='true' style='position: relative;float: right;top:2px;'></i>");
        taskArr[tasks[i].index] = cardDetail;
      }
      for(j=0;j<tasks.length;j++) {
        $("div#"+data.ListId+".card-wrap").children("div.list-cards").append(taskArr[j]);
      }
    });
});

// actual socket function to update orders of lists
socket.on('moveList', function() {
    $.get("/api/lists?BoardId="+BoardId, function(lists) {
      console.log(lists);
      for(i=0;i<lists.length;i++){
        var correctList = $($("#lists").children()[lists[i].index]);
        correctList.attr('id',lists[i].id);
        correctList.children("h6").html(lists[i].title);
        correctList.children("div.list-cards").html('');
        var tasks = [];
        tasks.length = lists[i].Tasks.length;
        for(j=0;j<lists[i].Tasks.length;j++) {
          var cardDetail = $("<p class='card-detail ui-state-default'>");
          cardDetail.attr('id', lists[i].Tasks[j].id);
          cardDetail.html(lists[i].Tasks[j].body +
              "<i class='fa fa-times deleteTask' aria-hidden='true' style='position: relative;float: right;top:2px;'></i>");
          tasks[lists[i].Tasks[j].index] = cardDetail;
        }
        for(k=0;k<tasks.length;k++){
          correctList.children("div.list-cards").append(tasks[k]);
        }
      }
    });
});

//////////////////////////////////////////////////////////////////////////////////
/////////////////////////// ADDING LISTS/TASK CARDS //////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

///////////////////////////// ADD CARDS //////////////////////////////////////////

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

// event listener for making new task in real time
socket.on("task", function(data) {
  var cardDetail = $("<p class='card-detail ui-state-default'>");
  cardDetail.attr('id', data.id);
  cardDetail.html(data.body +
      "<i class='fa fa-times deleteTask' aria-hidden='true' style='position: relative;float: right;top:2px;'></i>");
  $("#lists").children("#"+data.ListId).children("div.list-cards").append(cardDetail);
});

// event listener for posting new task to db
$(document).on("submit", "form.addCard", function(event) {
    event.preventDefault();
    var newCard = $(this);
    if (!newCard.children("input.newCard").val().trim()) {
      newCard.children("input.newCard").focus().select();
      return;
    }
    var body = newCard.children("input.newCard").val().trim();
    newCard.children("input.newCard").val('').focus().select();

    var parent = $(this).parent().children("div.list-cards");
    var numCards = parent.children().length;

    $.post("/api/tasks", {
        body: body,
        index: numCards,
        ListId: parent.parent().attr('id')
    }, function(data) {
        socket.emit("task",data);
    });
});

// event listener to close the add card form when x is pressed
$(document).on("click", ".closeAddCard", function(event) {
    event.stopPropagation();
    var addCard = $("<a class='addCardLink' href='#'>").text("Add a card...");
    $(this).parent().replaceWith(addCard);
});

//////////////////////////////////// ADD LISTS ////////////////////////////////////

// jQuery capture of addList form element
var addList = $("#addList");

// helper to replace form with link on blur of add list form
function addListOnBlur(input) {
    if (!$(input).siblings("button").attr("mouseDown") && !$(input).siblings(".closeAddList").attr("mouseDown")) {
        var addListSpan = $("<span>").text("Add a list...");
        addListSpan.attr('value', $(input).val());
        $(input).parent().parent().html(addListSpan);
    }
}

// helper to prevent blur when enter is pressed to submit a List
function addListOnEnter(event,input) {
  if(event.which == 13) {
    event.stopImmediatePropagation();
    $(input).attr('onblur','');
    $(input).parent().submit();
  }
}

// event listener to replace add a list span with form
$(document).on("click","#addList span", function() {
  var wrapper = $("<div id='addListWrapper'>");
  var titleInput = $("<input type='text' class='editInput' id='title' placeholder='Add a list...' style='width:100%;border-radius:3px;display:block;border:none;padding:8px;font-size:14px;margin-bottom:8px;' onblur='addListOnBlur(this)' onkeydown='addListOnEnter(event,this)'>");
  if($(this).attr('value'))
    titleInput.val($(this).attr('value'));
  var button = $("<button class='btn btn-sm btn-success' type='submit' id='newList'>").text('Save');
  var closeBtn = $('<i class="fa fa-times closeAddList" aria-hidden="true" style="position:relative;top:3px;">');
  wrapper.append(titleInput,button,closeBtn);
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

// event listener to create new list IN REAL TIME
socket.on("list", function(data) {
    // console.log(data);
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
            var dataTask = $(this).sortable('toArray');
            var ListId = $(this).parent().attr('id');
            console.log(dataTask);
            console.log(ListId);
            $.post("/api/tasks/update?ListId=" + ListId, { data: dataTask }, function() {
              socket.emit("moveCards", { ListId: ListId });
            });
        },
        helper: 'clone'
    });
    $("#lists").append(list);
    // clear input data
    $("#title").val("");
});

// event listener for posting new list to db
$(addList).on("submit", function(event) {
    event.preventDefault();

    var newListTitle = $("#title");
    if (!newListTitle.val().trim()) {
      newListTitle.attr('onblur','addListOnBlur(this)');
      newListTitle.focus().select();
      return;
    }
    var addListSpan = $("<span>").text("Add a list...");
    $(this).html(addListSpan);
    $.post("/api/lists", {
        title: newListTitle.val().trim(),
        index: $("#lists").children().length,
        BoardId: BoardId
    }, function(data) {
        socket.emit("list", data);
    });
});

// event listener to close the add list form when the x is pressed
$(document).on("click", ".closeAddList", function(event) {
    event.stopPropagation();
    var addListSpan = $("<span>").text("Add a list...");
    addList.html(addListSpan);
});



// event listener to add user to board
$(document).on("click", ".addUser", function() {
    // CREATE FORM TO SUBMIT USER (AUTO COMPLETION)
    var form = $("<form id='addUserForm'>");
    var input = $("<input id='#newUser'>");
    var submitBtn = $("<button type='submit' class='btn btn-sm btn-success'>");
    form.append(input,button);
    // (drop down from + sign)
    //console.log($('#newUser').val().trim());
    ///api/boards/:id/users/:userId
});

$(document).on("submit","#addUserForm", function() {

});

// event listeners to delete a list or task card upon clicking the x IN REAL TIME
// socket.on("deleteList",function(result){
//   var test = "#" + id;
//   console.log(result);
//   $(".card-wrap").remove(test);
//   var data = listEdited.sortable("toArray");
//   $.post("/api/lists/update", { data: data });
// });

//////////////////////////////////////////////////////////////////////////////////
/////////////////////////// DELETING LISTS/TASK CARDS ////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
// event listenener for deleting tasks in real time
socket.on("deleteList", function(test){
    $(".card-wrap").remove(test);
});

// event listener to delete a list
$(document).on("click", ".deleteList", function() {
    var id = $(this).parent().attr('id');
    var listEdited = $(this).parent().parent();
    $.ajax({
        method: "DELETE",
        url: "/api/lists/" + id
    }).done(function(result) {
        var test = "#" + id;
        console.log(result);
        // $(".card-wrap").remove(test);
        socket.emit('deleteList', test);
        var data = listEdited.sortable("toArray");
        $.post("/api/lists/update", { data: data });
    });
});

// event listenener for deleting tasks in real time
socket.on("deleteTask", function(test){
   $(".card-detail").remove(test);
});

// event listener to delete a task card
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
        // $(".card-detail").remove(test);
        socket.emit("deleteTask", test);
        var data = listEdited.sortable("toArray");
        $.post("/api/tasks/update?ListId=" + ListId, { data: data });
    });
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
