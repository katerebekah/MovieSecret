var express = require('express');
var router = express.Router();
var Confession = require('../models/confession');



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
  if (ourUser === null) {
    res.redirect("/user/login");
  } 
  var confessionID = req.body.db_id;
  removeUsersCurrentXandOs(ourUser, confessionID);
  addXcount(ourUser, confessionID);
  });
  
  router.post('/o', function(req, res, next) {
    //is the user logged in?
    var ourUser = UserController.getCurrentUser();
    if (ourUser === null) {
      res.redirect("/user/login");
    } 
    var confessionID = req.body.db_id;
    removeUsersCurrentXandOs(ourUser, confessionID);
    addXcount(ourUser, confessionID);
    });

  var removeUsersCurrentXandOs = function(user, confessionID) {
    User.findOne({_id:user._id}, function (err, foundUser){
      if (foundUser.xedMovies.indexOf(confessionID) >= 0) {
        foundUser.xedMovies.splice(foundUser.xedMovies.indexOf(confessionID), 1);
        foundUser.save(function(err, savedUser){
          if (err){
            console.log(err);
            sendError(req, res, err, "Could not save user update");
          } else {
            return removeXcount(confessionID);
          }
        });
      } else if (foundUser.oedMovies.indexOf(confessionID) >= 0) {
        foundUser.oedMovies.splice(foundUser.oedMovies.indexOf(confessionID), 1);
        foundUser.save(function(err, savedUser){
          if (err){
            console.log(err);
            sendError(req, res, err, "Could not save user update");
          } else {
            return removeOcount(confessionID);
          }
        });
      } else {
        return;
      }
    });
  };

  var removeXcount = function(confessionID){
    Confession.findOne({_id:confessionID}, function(err, foundConfession){
      if (err){
        console.log(err);
        sendError(req, res, err, "Could not find confession");
      } else {
        foundConfession.xCount = foundConfession.xCount - 1;
        foundConfession.save(function(err, savedConfession){
          if (err){
            console.log(err);
            sendError(req, res, err, "Could not save confession xcount");
          } else {
            return;
          }
        });
      }
    });
  };

  var removeOcount = function(confessionID){
    Confession.findOne({_id:confessionID}, function(err, foundConfession){
      if (err){
        console.log(err);
        sendError(req, res, err, "Could not find confession");
      } else {
        foundConfession.oCount = foundConfession.oCount - 1;
        foundConfession.save(function(err, savedConfession){
          if (err){
            console.log(err);
            sendError(req, res, err, "Could not save confession ocount");
          } else {
            return
          }
        });
      }
    });
  };

  var addXcount = function(confessionID, user) {
    Confession.findOne({_id:confessionID}, function(err, foundConfession){
      if (err){
        console.log(err);
        sendError(req, res, err, "Could not find confession");
      } else {
        foundConfession.xCount = foundConfession.xCount + 1;
        foundConfession.save(function(err, savedConfession){
          if (err){
            console.log(err);
            sendError(req, res, err, "Could not save confession xcount");
          } else {
            return addUserXed(savedConfession, user);
          }
        });
      }
    });
  };  

  var addOcount = function(confessionID, user) {
    Confession.findOne({_id:confessionID}, function(err, foundConfession){
      if (err){
        console.log(err);
        sendError(req, res, err, "Could not find confession");
      } else {
        foundConfession.oCount = foundConfession.oCount + 1;
        foundConfession.save(function(err, savedConfession){
          if (err){
            console.log(err);
            sendError(req, res, err, "Could not save confession ocount");
          } else {
            return addUserOed(savedConfession, user);
          }
        });
      }
    });
  };

  var addUserXed = function(confession, user){
    User.findOne({_id: user._id}, function(err, foundUser){
      if (err){
        console.log(err);
        sendError(req, res, err, "Could not find confession");
      } else {
        foundUser.xedMovies.push(confession);
        foundUser.save(function(err, savedUser){
          if (err){
            console.log(err);
            sendError(req, res, err, "Could not save confession");
          } else {
            return
          }
        });
      }
    });
  };

  var addUserOed = function(confession, user){
    User.findOne({_id: user._id}, function(err, foundUser){
      if (err){
        console.log(err);
        sendError(req, res, err, "Could not find user");
      } else {
        foundUser.oedMovies.push(confession);
        foundUser.save(function(err, savedUser){
          if (err){
            console.log(err);
            sendError(req, res, err, "Could not save user");
          } else {
            return
          }
        });
      }
    });
  };
  
module.exports = router;