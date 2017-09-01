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
    // if password is less than 8 characters or more than 255 characters, don't submit
    if(password.val().trim().length < 8 || password.val().trim().length > 255) {
      alert("Password needs to be greater than 7 characters and less than 256 characters");
      return;
    }
    // if username contains non-alphanumeric characters, don't submit
    if(/[^a-zA-Z0-9]/.test(username.val().trim())) {
      alert('Username must consist of only alphanumeric characters');
      return;
    }
    // check if username is taken
    $.get("/api/users/u?name="+username.val().trim(),function(user) {
      if(user != null) {
        alert("Username is taken.");
        return;
      }

      // check if email is taken
      $.get("/api/users/e?email="+email.val().trim(), function(emailcheck) {
        if(emailcheck != null) {
          alert("Email is already in use");
          return;
        }
        // Constructing a new user object to post to the database
        var newUser = {
          name: username.val().trim(),
          email: email.val().trim(),
          password: password.val().trim()
        };

        submitUser(newUser);
      });
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
