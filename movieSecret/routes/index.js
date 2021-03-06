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
      sendError(req, res, err, "Could not get task list");
    } else {
      //render the home page
      res.render('index', {
        title: 'Movie Secret',
        subtitle: 'confess your darkest movie secrets',
        confessions: confessions
      });
    }
  });
});

module.exports = router;
