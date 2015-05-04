var UserController = require('../userController');
var express = require('express');
var router = express.Router();
var confessionList = [];
var Confession = require('../models/confession');

//get profile page
router.get('/', function(req, res, next) {
	//database call for all secrets
	 Confession.find({}, function(err, confessions) {
	   if (err) {
	     console.log(err);
	     sendError(req, res, err, "Could not get profile");
	   } else {
	     //render the home page profile
	     res.render('profile', {
	       title: 'Movie Secret',
	       subtitle: 'confess your darkest movie secrets',
	       confessions: confessions
	     });
	   }
	 });

});


// Send the error message back to the client
var sendError = function (req, res, err, message) {
  res.render("error", {
    error: {
      status: 500,
      stack: JSON.stringify(err.errors)
    },
    message: message
  });
};

//tells node to send confessions for initial index page load
var sendConfessions = function(req, res, next){
	Confession.find({}, function(err, confessions){
		console.log('confessions:', confessions);
		if (err) {
			console.log(err);
			sendError(req, res, err, "Could not retrieve confessions.")
		} else {
			res.render("confessionList", {
				title: "Movie Secrets",
				subtitle: "confess your deepest movie secrets",
				confessions: confessions
			})
		}
	});
};

module.exports = router;