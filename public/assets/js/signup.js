$(document).ready(function() {
  // Getting jQuery references to the user info
  var username = $("#username");
  var email = $("#email");
  var password = $("#password");
  var confirmpass = $("#confirmPassword");
  var signupForm = $("#signup");

  // on submit form
  $(signupForm).on("submit", function handleFormSubmit(event) {
    event.preventDefault();
    // if any field is blank, don't submit
    if (!username.val().trim() || !password.val().trim() || !confirmpass.val().trim() || !email.val().trim()) {
      return;
    }
    // if password and confirm password don't match, don't submit
    if(password.val().trim() != confirmpass.val().trim()) {
      alert("Passwords do not match.");
      return;
    }
    // if username contains non-alphanumeric characters, don't submit
    if(/[^a-zA-Z0-9]/.test(password.val().trim())) {
      alert('Username must consist of only alphanumeric characters');
      return;
    }
    // check if username is taken
    $.get("/api/users/u?name="+username.val().trim(),function(data) {
      if(data != null) {
        alert("Username is taken.");
        return;
      }
      // Constructing a new user object to post to the database
      var newUser = {
        name: username.val().trim(),
        password: password.val().trim(),
      };

      submitUser(newUser);
    });
  });

  // Submits a user and brings user to profile page upon completion
  function submitUser(user) {
    $.post("/api/users", user, function(data) {
      localStorage.clear();
      localStorage.setItem('id',data.id);
      localStorage.setItem('username',user.name);
      window.location.href = "/board";
    });
  }
});
