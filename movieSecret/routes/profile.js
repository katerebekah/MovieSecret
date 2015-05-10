var Q = require("q");
var UserController = require('../userController');
var express = require('express');
var router = express.Router();
var confessionList = [];
var Confession = require('../models/confession');
var User = require('../models/user');
var ObjectId = require('mongoose').Types.ObjectId;


//get profile page
router.get('/', function(req, res, next) {
  var user = UserController.getCurrentUser();

  if (user !== null) {
    getConfessions(user).then(function(foundConfessions) {
      res.render('profile', {
        username: user.username,
        title: 'Movie Secret',
        subtitle: 'confess your darkest movie secrets',
        confessions: foundConfessions
      });

    }).fail(function(err) {
      sendError(req, res, {
        errors: err.message
      }, "Failed")
    });
  } else {
    res.redirect("/user/login");
  }

});

//POST new confession
router.post('/', function(req, res, next) {
  var user = UserController.getCurrentUser();
  //console.log("this is the req.body and user", req.body, user); 
  findConfession(req.body).then(function(confession) {
    addConfessiontoUser(confession._id, user._id);
  }).fail(function(err) {
    console.log(err);
  });

});


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

var getConfessions = function(validUser) {
  var deferred = Q.defer();

  Confession.find({
    _id: {
      $in: validUser.confessions.haventSeen
    }
  }, function(err, confessions) {
    if (!err) {
      deferred.resolve(confessions);
    } else if (err) {
      console.log(err);
      deferred.reject(err);

    }
  });
  return deferred.promise;

};

var findConfession = function(con) {
  var deferred = Q.defer();

  Confession.findOne({
    imdbID: confession.imdbID
  }, function(err, foundConfession) {
    if (!err) {
      if (foundConfession) {
        deferred.resolve(foundConfession);
      } else {
        addConfessiontoDB(con);
      }
    } else if (err) {
      console.log(err);
      deferred.reject(err);
    }
  });
  return deferred.promise;
};

var addConfessiontoDB = function(confess) {
  var newConfession = new Confession(confess);
  newConfession.save(function(err, confession) {
    if (err) {
      console.log(err);
    } else {
      return confession;
    }
  })
}

var addConfessiontoUser = function(userID, confessionID) {
  var deferred = Q.defer();

  User.findOne({
    _id: userID
  }, function(err, user) {
    console.log('found the user to add a confession')
    if (err) {
      console.log(err);
      deferred.reject(err)
    } else {
      deferred.resolve(user)
    }
    return deferred.promise;
  }).then(function(user) {

    user.confessions.haventSeen.push(confessionID);
    user.save(function(err, savedUser) {
      if (err) {
        console.log(err);
        sendError(req, res, err, "can't save user confessions array");
      } else {
        console.log("saved user", savedUser)
        return savedUser;
      }
    });
  });
}

module.exports = router;
