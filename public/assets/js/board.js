var numLists;
	var BoardId = localStorage.getItem('BoardId');
$(document).ready(function(){
	$.get("/api/lists?BoardId="+BoardId,function(data){
        console.log("WERADFASDFAWREW")
		numLists = data.length;
		var lists = [];
		lists.length = numLists;
		for(i=0;i<numLists;i++){
			var newList = $("<div class='card-wrap'>");
			newList.attr('id',data[i].id);
			var header = $("<h6 class='list-header'>");
			header.text(data[i].title);
			var content = $("<div  class='list-cards'>");
			var tasks = [];
			tasks.length = data[i].Tasks.length;
			for(j=0;j<tasks.length;j++){
				var cardDetail = $("<p class='card-detail ui-state-default'>");
				cardDetail.attr('id',data[i].Tasks[j].id);
				cardDetail.text(data[i].Tasks[j].body);
				tasks[data[i].Tasks[j].index] = cardDetail;
			}
			for(j=0;j<tasks.length;j++){
				content.append(tasks[j]);
			}
			// var addCard = $("<a> Add a card </a>");

			var form = $("<form class='addCard'>");
			var input = $("<input class='newCard'>");
			var button = $("<button type='submit' class='makingNewCard'>Add new card</button>");

			form.append(input,button);
			newList.append(header,content,form);
			$(content).sortable({
				connectWith: ".list-cards",
				placeholder:"ui-sortable-placeholder-cards",
				start: function(e,ui){
				ui.placeholder.height(ui.helper.outerHeight());
				},
				update: function(e,ui){
					var dataTask = $(this).sortable('toArray');
					var ListId = $(this).parent().attr('id');
					console.log(dataTask);
					console.log(ListId);
					$.post("/api/tasks/update?ListId="+ListId,{data:dataTask});
				}
			});
			lists[parseInt(data[i].index)]=newList;
		}
		for(i=0;i<numLists;i++){
			$("#lists").append(lists[i]);
		}
	});
});

$("#lists").sortable({
	placeholder:"ui-sortable-placeholder-lists",
	start: function(e,ui){
		ui.placeholder.height(ui.helper.outerHeight());
	},
	tolerance: 'pointer',
	update: function(event, ui) {
		var data = $(this).sortable('toArray');
		console.log(data);
		$.post("/api/lists/update",{data:data});
	}
});

var addList = $("#addList");
var newListTitle = $("#title");
// <<<<<<< HEAD
$(addList).on("submit",function(event){
	event.preventDefault();
	if(!newListTitle.val().trim()){
		return;
	}
	$.post("/api/lists",{
		title:newListTitle.val().trim(),
		index:numLists
	}, function(data){
		numLists++;
		var list = $("<div class='card-wrap'>");
		list.attr('id',data.id);
		var header = $("<h6 class='list-header'>");
		header.text(newListTitle.val().trim());

		var content = $("<div  class='list-cards'>");

		// var addCard = $("<a> Add a card </a>");

		var form = $("<form class='addCard'>");
		var input = $("<input class='newCard'>");
		var button = $("<button type='submit' class='makingNewCard'>Add new card</button>");

		form.append(input,button);
		list.append(header,content,form);
		$(content).sortable({
			connectWith: ".list-cards",
			placeholder:"ui-sortable-placeholder-cards",
			start: function(e,ui){
			ui.placeholder.height(ui.helper.outerHeight());
			},
			update: function(e,ui){
				var data = $(this).sortable('toArray');
				console.log(data);
				console.log(data);
				var ListId = $(this).parent().attr('id');
				$.post("/api/tasks/update?ListId="+ListId,{data:data});
			}
		});
		$("#lists").append(list);
	  // clear input data
		$("#title").val("");
	});
});

$(document).on("click",".makingNewCard" ,function(event){
	event.preventDefault();
	var newCard = $(this).parent().children("input.newCard");

	if(!newCard.val().trim()){
		return;
	}
	var numCards = $(this).parent().parent().children("div.list-cards").children().length;
	var parent = $(this).parent().parent().children("div.list-cards");
	$.post("/api/tasks",{
		body: newCard.val().trim(),
		index: numCards,
		ListId: parent.parent().attr('id')
	}, function(data){
	var cardDetail = $("<p class='card-detail ui-state-default'>");
	cardDetail.attr('id',data.id);
	cardDetail.text(newCard.val().trim());
	parent.append(cardDetail);
	// clear input data
	newCard.val("");
});
});
// =======

/*/*//*/*$(addList).on("submit", function(event) {
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
}*//*/*/
// >>>>>>> 35c58c8dc179a5a6a64d3984be8b6934a6c68b9e
