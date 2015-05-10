var Q = require("q");
var express = require('express');
var app = express.Router();
var UserController = require("../userController");
var UserModel = require("../models/user");
var Confession = require("../models/confession");

// Send the error message back to the client
var sendError = function(req, res, err, message) {
  console.log('Render the error template back to the client.');
  res.render("error", {
    error: {
      status: 500,
      stack: JSON.stringify(err.errors)
    },
    message: message
  });
};

// Retrieve all tasks for the current user
var getUserTasks = function(userId) {
  var deferred = Q.defer();

  console.log('Another promise to let the calling function know when the database lookup is complete');

  Confession.find({
    user: userId
  }, function(err, tasks) {
    if (!err) {
      console.log('Tasks found = ' + tasks.length);
      console.log('No errors when looking up tasks. Resolve the promise (even if none were found).');
      deferred.resolve(tasks);
    } else {
      console.log('There was an error looking up tasks. Reject the promise.');
      deferred.reject(err);
    }
  })

  return deferred.promise;
};


// Handle the request for the registration form
app.get("/register", function(req, res) {
  res.render("register", {
    title: "Movie Secret",
    subtitle: "confess your darkest movie secrets"
  });
});


// Handle the registration form post
app.post("/register", function(req, res) {
  var newUser = new UserModel(req.body);

  newUser.save(function(err, user) {
    if (err) {
      sendError(req, res, err, "Failed to register user");
    } else {
      res.redirect("/profile");
    }
  });
});

// Handle the request for the log in form
app.get("/login", function(req, res) {
  res.render("login", {
    title: "Movie Secret",
    subtitle: "confess your darkest movie secrets"
  });
});

// Handle the login action
app.post("/login", function(req, res) {

  console.log('Hi, this is Node handling the /user/login route');

  // Attempt to log the user is with provided credentials
  UserController.login(req.body.username, req.body.password)

  // After the database call is complete and successful,
  // the promise returns the user object
  .then(function(validUser) {

    console.log('Ok, now we are back in the route handling code and have found a user');
    console.log('leaving usersjs and heading to profilejs');
    res.redirect('/profile')
      
  })
});


module.exports = app;
