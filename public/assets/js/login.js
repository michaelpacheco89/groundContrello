$(document).ready(function() {
  // Getting jQuery references to the user info
  var username = $("#username");
  var password = $("#password");
  var loginForm = $("#login");

  $(loginForm).on("submit", function handleFormSubmit(event) {
    event.preventDefault();
    // if any field is blank, don't submit
    if (!username.val().trim() || !password.val().trim()) {
      return;
    }
    // Constructing a user object to hand to the database
    var user = {
      username: username.val().trim(),
      password: password.val().trim(),
    };

    submitUser(user);
  });

  // Submits a user and brings user to profile page upon completion
  function submitUser(user) {
    // set query name to allow for login with username or email
    var queryName = 'name';
    if(user.username.indexOf('@') != -1){
      queryName = 'email';
    }
    $.post("/api/users/login?" + queryName + "=" + user.username, user, function(data) {
      if(data.username){
        alert("Incorrect email or username");
        return;
      } else if(!data.password) {
        alert("Incorrect password");
        return;
      } else {
        localStorage.clear();
        localStorage.setItem('id',data.id);
        localStorage.setItem('username',user.username);
        window.location.href = "/board";
      }
    });
  }
});
