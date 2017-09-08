var title;
var boardName = $("#boardName");
var teamName = $("#teamName");
var teamDescription = $("#teamDescription");

function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");

}

$(document).ready(function() {
    $.get("/api/users/" + localStorage.getItem("id"), function(data) {
        //console.log(data.Boards.length)
        var boards = data.Boards;
        var numBoards = data.Boards.length;
        for (var i = 0; i < numBoards; i++) {
            //console.log(boards[i].name, "////", boards[i].id);
            var newBD = $("<li><a></li></a>");
            boardName.css({ "font-size": "1em" });
            newBD.text(boards[i].name);
            newBD.attr('id', boards[i].id);
            $(".boards-wrapper").append(newBD);
        }
    });
});

// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {

        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
};


$(document).on("click", "#popover1", function(event) {
    event.preventDefault();
    $("#newBoardInfo").show();
});

$("#newBoard").on("click", function(event) {
    event.preventDefault();
    if (!boardName.val().trim()) {
        return;
    }
    var newBD = $("<li><a></li></a>");
    boardName.css({ "font-size": "1em" });
    newBD.text(boardName.val().trim());

    createBoard({
        name: boardName.val().trim(),
        OwnerId: parseInt(localStorage.getItem('id'))
    }, newBD);

    // clear input datas
    boardName.val("");
});

$(document).on("click", "#popover2", function(event) {
    event.preventDefault();
    $("#newTeamInfo").show();
});

$(document).on("click", ".boards-wrapper li", function(event) {
    //console.log("CLICKED! ID is: " + $(this).attr('id'));
    localStorage.setItem('BoardId', $(this).attr('id'));
    window.location.href = "/board";
});

function createBoard(board, BD) {
    //console.log(board)
    $.post("/api/boards", board, function(data) {
        //localStorage.setItem('board', data.id);
        BD.attr('id', data.id);
        // BD.attr('name', data.title);
        $(".boards-wrapper").append(BD);
    });
    //
}

// $("#newTeam").on("click", function(event){
//   event.preventDefault();
//   if (!teamName.val().trim()){
//     return;
//   }
//   var teamTitle = $("<li><a></li></a>");
//   var teamInfo = $()
//   newTm.text(teamName.val().trim());
//   $(".teams-wrapper").append(newTm, teamDescription);
//   // clear inpur datas
//   teamName.val(" ");

// })
