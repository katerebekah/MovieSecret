var Q = require("q");
var UserController = require('../userController');
var express = require('express');
var router = express.Router();
var confessionList = [];
var Confession = require('../models/confession');
var User = require('../models/user');
var ObjectId = require('mongoose').Types.ObjectId;

// Send the error message back to the client
var sendError = function(req, res, err, message) {
  res.render("error", {
    error: {
      status: 500,
      stack: JSON.stringify(err.errors)
    },
    message: message
  });
};

/* GET home page. */
router.get('/', function(req, res, next) {
  //database call for all secrets
  Confession.find({}, function(err, confessions) {
    if (err) {
      console.log(err);
      sendError(req, res, err, "Could not get Confession list");
    } else {
      res.render('index', {
        title: 'Movie Secret',
        subtitle: 'confess your darkest movie secrets',
        confessions: confessions
      });
    }
  });
});

router.post('/x', function(req, res, next) {
  //is the user logged in?
  var ourUser = UserController.getCurrentUser();
  if (ourUser !== null) {
    var confessionID = req.body._id;
    removeUsersCurrentXandOs(ourUser, confessionID);
    addXcount(ourUser, confessionID);
    UserController.removeXOs(confessionID);
    UserController.addX(confessionID);
  res.send("successful");
  } else {
    res.redirect("/user/login");
  }
});

router.post('/o', function(req, res, next) {
  //is the user logged in?
  var ourUser = UserController.getCurrentUser();
  if (ourUser !== null) {
    var confessionID = req.body._id;
    removeUsersCurrentXandOs(ourUser, confessionID);
    addOcount(ourUser, confessionID);
    UserController.removeXOs(req.body._id);
    UserController.addO(req.body._id);
    res.send("successful");
  } else {
    res.send("this user is not logged in");
  }
});

var removeUsersCurrentXandOs = function(user, confessionID) {
  User.findOne({
    _id: user._id
  }, function(err, foundUser) {
    if (foundUser.xedMovies.indexOf(confessionID) >= 0) {
      console.log("this user has xed this movie before")
      foundUser.xedMovies.splice(foundUser.xedMovies.indexOf(confessionID), 1);
      foundUser.save(function(err, savedUser) {
        if (err) {
          console.log(err);
          sendError(req, res, err, "Could not save user update");
        } else {
          return removeXcount(confessionID);
        }
      });
    } else if (foundUser.oedMovies.indexOf(confessionID) >= 0) {
      console.log("this user has oed this movie before")
      foundUser.oedMovies.splice(foundUser.oedMovies.indexOf(confessionID), 1);
      foundUser.save(function(err, savedUser) {
        if (err) {
          console.log(err);
          sendError(req, res, err, "Could not save user update");
        } else {
          return removeOcount(confessionID);
        }
      });
    } else {
      console.log("this user has neither xed or oed this movie before")
      return;
    }
  });
};

var removeXcount = function(confessionID) {
  Confession.findOne({
    _id: confessionID
  }, function(err, foundConfession) {
    if (err) {
      console.log(err);
      sendError(req, res, err, "Could not find confession");
    } else {
      foundConfession.xCount = foundConfession.xCount - 1;
      foundConfession.save(function(err, savedConfession) {
        if (err) {
          console.log(err);
          sendError(req, res, err, "Could not save confession xcount");
        } else {
      console.log("removeXcount completed", savedConfession.xCount)
          return;
        }
      });
    }
  });
};

var removeOcount = function(confessionID) {

  Confession.findOne({
    _id: confessionID
  }, function(err, foundConfession) {
    if (err) {
      console.log(err);
      sendError(req, res, err, "Could not find confession");
    } else {
      foundConfession.oCount = foundConfession.oCount - 1;
      foundConfession.save(function(err, savedConfession) {
        if (err) {
          console.log(err);
          sendError(req, res, err, "Could not save confession ocount");
        } else {
      console.log("removeOcount completed", savedConfession.oCount)
          return
        }
      });
    }
  });
};

var addXcount = function(user, confessionID) {
      console.log("addXcount initiated with confessionID:", confessionID)
  Confession.findOne({
    _id: confessionID
  }, function(err, foundConfession) {
    if (err) {
      console.log(err);
      sendError(req, res, err, "Could not find confession");
    } else {
      foundConfession.xCount = foundConfession.xCount + 1;
      foundConfession.save(function(err, savedConfession) {
        if (err) {
          console.log(err);
          sendError(req, res, err, "Could not save confession xcount");
        } else {
          console.log("saved updated xcount, saved confession: ", savedConfession);
          return addUserXed(savedConfession, user);
        }
      });
    }
  });
};

var addOcount = function(user, confessionID) {
      console.log("addOcount initiated");
  Confession.findOne({
    _id: confessionID
  }, function(err, foundConfession) {
    if (err) {
      console.log(err);
      sendError(req, res, err, "Could not find confession");
    } else {
      foundConfession.oCount = foundConfession.oCount + 1;
      foundConfession.save(function(err, savedConfession) {
        if (err) {
          console.log(err);
          sendError(req, res, err, "Could not save confession ocount");
        } else {
      console.log("adding confession's xcount by one", savedConfession)
          return addUserOed(savedConfession, user);
        }
      });
    }
  });
};

var addUserXed = function(confession, user) {
      console.log("addUserXed initiated, ", user)

  User.findOne({
    _id: user._id
  }, function(err, foundUser) {
    if (err) {
      console.log(err);
      sendError(req, res, err, "Could not find confession");
    } else {
      foundUser.xedMovies.push(confession._id);
      foundUser.save(function(err, savedUser) {
        if (err) {
          console.log(err);
          sendError(req, res, err, "Could not save confession");
        } else {
          console.log("added confession to user's xedMovies -- returning", savedUser)
          return;
        }
      });
    }
  });
};

var addUserOed = function(confession, user) {
      console.log("addUserOed initiated")
  User.findOne({
    _id: user._id
  }, function(err, foundUser) {
    if (err) {
      console.log(err);
      sendError(req, res, err, "Could not find user");
    } else {
      foundUser.oedMovies.push(confession._id);
      foundUser.save(function(err, savedUser) {
        if (err) {
          console.log(err);
          sendError(req, res, err, "Could not save user");
        } else {
          console.log("saving confession to user's oedMovies,", savedUser);
          return
        }
      });
    }
  });
};

module.exports = router;
