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
  console.log(req.body);
  if (req.body.edit) {
    removeConfession(user, req.body.edit);
  }
  Confession.findOne({
    imdbID: req.body.imdbID
  }, function(err, result) {
    if (err){
      res.send(err);
    } 
    if (!result) {
      addConfessiontoDB(req.body);
    }
    if (result) { 
      addConfessiontoUser(user, result._id)
    }
  }).then(function(confession){
    
  res.send('thanks for all the fish');
  })
});

router.delete('/', function(req, res, next){
  var user = UserController.getCurrentUser();
  removeConfession(user, req.body._id);
  res.send('thanks for all the fish');
});

router.get('/:id', function(req, res, next){
  //is the user logged in?
  var currentUser = UserController.getCurrentUser();

  Confession.find({
      _id: req.params.id
  }, function(err, item) {
      var thisItem = item[0];
      console.log(thisItem);

      // Was there an error when retrieving?
      if (err) {
          sendError(req, res, err, "Could not find a task with that id");

          // Find was successful
      } else {
          res.render('edit', {
              title: 'Movie Secret',
              subtitle: "confess your darkest movie secrets",
              thisItem: thisItem
          });
      }
  });
})


//remove item from hasntseen list
var removeConfession = function (user, confessionID){
  User.findOne({_id: user._id}, function(err, foundUser){
    if (err) {
      sendError(req, res, err, "failed to retrieve user");
    } else {
        console.log(foundUser);
        foundUser.confessions.haventSeen.splice(foundUser.confessions.haventSeen.indexOf(confessionID), 1);
        foundUser.save(function(err, savedUser) {
        if (err) {
            console.log(err);
            sendError(req, res, err, "Could not save user update");
          } 
          return
          });
    }
  })
}

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
      return confession
    }
  }).then(function(confession){
    var endUser = UserController.getCurrentUser()
      return addConfessiontoUser(endUser, confession._id);
  })
}

var addConfessiontoUser = function(user, confessionID) {
  User.findOne({
    _id: user._id
  }, function(err, founduser) {
    if (err) {
      console.log(err);
    } else {
      founduser.confessions.haventSeen.push(confessionID);
      founduser.save(function(err, savedUser) {
        if (err) {
          console.log(err);
          sendError(req, res, err, "can't save user confessions array");
        } else {
          console.log("this is the saved user,", savedUser)
          return savedUser;
          }
      });
    }
  })

};

module.exports = router;
