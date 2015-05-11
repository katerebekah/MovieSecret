var Q = require("q");
var UserController = require('../userController');
var express = require('express');
var router = express.Router();
var confessionList = [];
var Confession = require('../models/confession');

// Handle a GET request from the client to /profile/:id
router.get('/:id', function(req, res) {
    console.log("edit called");
    // Is the user logged in?
    if (UserController.getCurrentUser() === null) {
        res.redirect("/");
    }

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
});

//Post Confession to database
router.post('/', function(req, res, next) {
    // If user is editing a confession
    console.log("this is the req.body", req.body);
    if (req.body._id) {
        console.log("editing an existing entry")
        //Find it
        Confession.findOne({
            _id: req.body._id
        }, function(err, foundconfession) {
            if (err) {
                sendError(req, res, err, "could not find this confession");
            } else {
                //found confession------ update
                //foundconfession = req.body;
                console.log('this is the foundconfession', foundconfession);
                // save updated item
                foundconfession.confession = req.body.confession;
                foundconfession.poster = req.body.poster;
                foundconfession.awards = req.body.awards;
                foundconfession.year = req.body.year;
                foundconfession.save(function(err, newOne) {
                    if (err) {
                        sendError(req, res, err, "Could not save with updated Confession");
                    } else {
                        console.log("Edit Succesful");
                    }

                }).then(function(confession){
                    console.log("entering the callback to redirect")
                        res.send("success")
                });
            }
        });

    } else {
        // User created new item
        // Find user

        var theUser = UserController.getCurrentUser();

        // What did the user enter in the form?
        var theFormPostData = req.body;
        
        theFormPostData.user = theUser._id;

        console.log('theFormPostData', theFormPostData);

        var myconfession = new Confession(theFormPostData);

        myconfession.save(function(err, confession) {
            if (err) {
                sendError(req, res, err, "Could not add new confession");
            } else {
                console.log("New confession is Saved");
            }
        }).then(function(confession){
            res.send('success');
        })
    }
});


//get profile page
router.get('/', function(req, res, next) {
    var user = UserController.getCurrentUser();
    console.log(user)

    if (user !== null) {
        getUserConfessions(user._id).then(function(confessions) {
            //render the home page profile
            res.render('profile', {
                username: user.username,
                title: 'Movie Secret',
                subtitle: 'confess your darkest movie secrets',
                confessions: confessions
            });
        });
    } else {
        res.redirect("/user/login");
    }

});

// Delete function
router.delete('/', function(req, res, next) {
    Confession.find({
            _id: req.body.confession
        })
        .remove(function(err) {
            if (!err) {

                res.send("Yes we are working");

            } else {

                console.log(err);



            }

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

//tells node to send confessions for initial index page load
var sendConfessions = function(req, res, next) {
    Confession.find({}, function(err, confessions) {
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


var getUserConfessions = function(userId) {
    var deferred = Q.defer();

    console.log('Another promise to let the calling function know when the database lookup is complete');

    Confession.find({
        user: userId
    }, function(err, confessions) {
        if (!err) {
            console.log('confessions found = ' + confessions.length);
            console.log('No errors when looking up confessions. Resolve the promise (even if none were found).');
            deferred.resolve(confessions);
        } else {
            console.log('There was an error looking up confessions. Reject the promise.');
            deferred.reject(err);
        }
    })

    return deferred.promise;
};

module.exports = router;
