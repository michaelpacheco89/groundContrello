var socket = io.connect();

// to keep track of the number of lists on the page for index purposes
var numLists;
// id to get the correct lists for the board
var BoardId = localStorage.getItem('BoardId');

// event listener to submit nearest form when enter key pressed while focused on input
$("form").submit(function(event) {
        event.preventDefault();
});

function submitOnFocusOut(input) {
    if(!$(input).val()) {
      $(input).val($(input).attr('value'));
    }
    $(input).parent().submit();
}

// event listener to edit title of lists and lists
$(document).on("click",".list-header, .card-detail", function() {
  var placeholder = $(this).text();
  var editForm = $("<form>");
  var listIdInput = $("<input type='hidden' name='id'>");
  var editInput = $("<input type='text' class='editInput' value='"+placeholder+"' onfocusout='submitOnFocusOut(this)'>").val(placeholder);
  editInput.attr('name','text');
  if($(this).hasClass("list-header")) {
    editForm.attr('class','editListForm');
    listIdInput.attr('value', $(this).parent().attr('id'));
  } else {
    editForm.attr('class','editTaskForm');
    listIdInput.attr('value', $(this).attr('id'));
  }
  editForm.append(listIdInput, editInput);
  $(this).replaceWith(editForm);
  $(".editInput").focus().select();
});

// event listeners to return the list/task body back from input to text
$(document).on("submit", ".editListForm, .editTaskForm",function(event) {
  event.preventDefault();
  var $form = $(this);
  var queryString;
  var editObject={
    id:$form.find("input[name='id']").val()
  };
  var newContent;
  if(!$form.find("input[name='text']").val()){
    $form.find("input[name='text']").val($form.find("input[name='text']").attr('value'));
  }
  if($form.hasClass("editListForm")) {
    newContent = $("<h6 class='list-header'>");
    editObject.title = $form.find("input[name='text']").val();
    queryString = "/api/lists";
  } else {
    newContent = $("<p class='card-detail ui-state-default'>");
    newContent.attr('id',$form.find("input[name='id']").val());
    newContent.append(
        "<i class='fa fa-times deleteTask' aria-hidden='true' style='position: relative;float: right;'></i>");
    editObject.body = $form.find("input[name='text']").val();
    queryString = "/api/tasks";
  }
  newContent.prepend($form.find("input[name='text']").val());
  $.ajax({
    method:"PUT",
    url:queryString,
    data: editObject
  }).done(function() {
    $form.replaceWith(newContent);
  });
});

// populate the page with the right lists in the right order on load
// var BoardId = localStorage.getItem('board');

$(document).ready(function() {
    $.get("/api/lists?BoardId=" + BoardId, function(data) {
        numLists = data.length;
        var lists = [];
        lists.length = numLists;
        for (i = 0; i < numLists; i++) {
            var newList = $("<div class='card-wrap'>");
            newList.attr('id', data[i].id);
            var header = $("<h6 class='list-header'>");
            header.text(data[i].title);
            var remove = $("<i class='fa fa-times deleteList' aria-hidden='true' style='position: relative;float: right;'></i>");
            var content = $("<div  class='list-cards'>");
            var tasks = [];
            tasks.length = data[i].Tasks.length;
            for (j = 0; j < tasks.length; j++) {
                var cardDetail = $("<p class='card-detail ui-state-default'>");
                cardDetail.attr('id', data[i].Tasks[j].id);
                cardDetail.html(data[i].Tasks[j].body +
                    "<i class='fa fa-times deleteTask' aria-hidden='true' style='position: relative;float: right;'></i>");
                tasks[data[i].Tasks[j].index] = cardDetail;
            }
            for (j = 0; j < tasks.length; j++) {
                content.append(tasks[j]);
            }
            // var addCard = $("<a> Add a card </a>");

            var form = $("<form class='addCard'>");
            var input = $("<input class='newCard'>");
            var button = $("<button type='submit' class='makingNewCard'>Add new card</button>");

            form.append(input, button);
            newList.append(remove, header, content, form);
            $(content).sortable({
                connectWith: ".list-cards",
                placeholder: "ui-sortable-placeholder-cards",
                start: function(e, ui) {
                    ui.placeholder.height(ui.helper.outerHeight());
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
var newListTitle = $("#title");

// real time new list
socket.on("list", function(data){
  console.log(data);


      numLists++;
      var list = $("<div class='card-wrap'>");
      list.attr('id', data.id);
      var remove = $("<i class='fa fa-times deleteList' aria-hidden='true' style='position: relative;float: right;'></i>");
      var header = $("<h6 class='list-header'>");
      header.text(data.title);

      var content = $("<div  class='list-cards'>");

      // var addCard = $("<a> Add a card </a>");

      var form = $("<form class='addCard'>");
      var input = $("<input class='newCard'>");
      var button = $("<button type='submit' class='makingNewCard'>Add new card</button>");

      form.append(input, button);
      list.append(remove, header, content, form);
      // making the list of tasks sortable
      $(content).sortable({
          connectWith: ".list-cards",
          placeholder: "ui-sortable-placeholder-cards",
          start: function(e, ui) {
              ui.placeholder.height(ui.helper.outerHeight());
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
// event listener to create new list
$(addList).on("submit", function(event) {
      event.preventDefault();
      if (!newListTitle.val().trim()) {
          return;
      }
      $.post("/api/lists", {

          title: newListTitle.val().trim(),
          index: numLists,
          BoardId: localStorage.getItem('BoardId')
      }, function(data) {
        socket.emit("list", data);
      });

});

// event listener for making new task
$(document).on("click", ".makingNewCard", function(event) {
    event.preventDefault();
    var newCard = $(this).parent().children("input.newCard");

    if (!newCard.val().trim()) {
        return;
    }
    var numCards = $(this).parent().parent().children("div.list-cards").children().length;
    var parent = $(this).parent().parent().children("div.list-cards");
    $.post("/api/tasks", {
        body: newCard.val().trim(),
        index: numCards,
        ListId: parent.parent().attr('id')
    }, function(data) {
        var cardDetail = $("<p class='card-detail ui-state-default'>");
        cardDetail.attr('id', data.id);
        cardDetail.html(newCard.val().trim() +
            "<i class='fa fa-times deleteTask' aria-hidden='true' style='position: relative;float: right;'></i>");
        parent.append(cardDetail);
        // clear input data
        newCard.val("");
    });
});

// event listener to sign out
$(document).on("click", ".sign-out", function() {
	document.cookie = "userId=''; expires=Thu, 18 Dec 2002 12:00:00 UTC; path=/";
	window.location.href = "/login";
});

// event listeners to delete a list or task card upon clicking the x
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
//     BoardId: parseInt(localStorage.getItem("BoardId"))
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
