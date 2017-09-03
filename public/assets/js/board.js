var list;
var addList = $("#addList");
var newListTitle = $("#title");

$(addList).on("submit", function(event) {
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
    $("#lists").prepend(list);

    //console.log(newListTitle,newListTitle.val().trim());
    createList({
        title: newListTitle.val().trim(),
        BoardId: parseInt(localStorage.getItem("board"))
    });

    // clear input data
    $("#title").val(" ");
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

    createTask({
        body: newCard.val().trim(),
        ListId: parseInt(localStorage.getItem("list"))
    });

    // clear input data
    $(".newCard").val("");
});

function createTask(task) {
    $.post("/api/tasks", task, function(data) {
        console.log(data);
        localStorage.setItem('task', data.id);
    });
};

function createList(list) {
    $.post("/api/lists", list, function(data) {
        console.log(data);
        localStorage.setItem('list', data.id);
    });
}