var title;
var boardName = $("#boardName");
var teamName = $("#teamName");
var teamDescription = $("#teamDescription");
function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");

}

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
}

$(document).on("click", "#popover1", function(event) {
      event.preventDefault();
      $("#newBoardInfo").show();
});

$("#newBoard").on("click", function(event){
    event.preventDefault();
    if (!boardName.val().trim()){
      return;
    }
   var newBD = $("<li><a></li></a>");
   boardName.css({"font-size":"1em"});
   newBD.text(boardName.val().trim());
   $(".boards-wrapper").append(newBD);

   // clear input datas
  boardName.val(" ");
})

$(document).on("click", "#popover2", function(event) {
      event.preventDefault();
      $("#newTeamInfo").show();
});

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
