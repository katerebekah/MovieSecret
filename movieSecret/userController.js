var UserModel = require("./models/user");
var Q = require("q");

var User = function () {
  this.currentUser = null;
};

User.prototype.login = function (username, password) {
  var deferred = Q.defer();

  console.log('Let\'s find a user with the same username and password as what was submitted in the form');

  UserModel.findOne({username: username}, function (err, user) {
    if (err){
      console.log(err);
    }
    if (!err) {

      console.log('We looked for a user and no error.');
      console.log('Here is the user:', user);

      // No errors doesn't mean we actually found a user
      if (user !== null) {

        console.log('Save the user information in an instance variable called this.currentUser');
        this.currentUser = user;

        console.log('Resolve the promise so that the login process can continue.');
        deferred.resolve(user);
      } else {
        deferred.reject(new Error("Could not find user"));
      }

    } else {

      console.log('Oh no! There was an error while looking for a matching user.');

      deferred.reject();
    }
  }.bind(this));

  return deferred.promise;
};

User.prototype.logout = function (username, password) {
  this.currentUser = null;
};

User.prototype.getCurrentUser = function () {
  return this.currentUser;
};

User.prototype.addConfession = function (confession) {
  this.currentUser.confessions.haventSeen.push(confession);
};

User.prototype.removeConfession = function (confession){
  this.currentUser.confessions.haventSeen.splice(this.currentUser.confessions.haventSeen.indexOf(confession), 1);
};

User.prototype.addX = function(confession){
  console.log("made it to user controller addx");
  this.currentUser.xedMovies.push(confession);
  return
}

User.prototype.addO = function(confession){
  console.log("made it to user controller addo");
  this.currentUser.oedMovies.push(confession);
  return
}

User.prototype.removeXOs = function(confession){
  console.log("made it to user controller");
  if (this.currentUser.xedMovies.indexOf(confession) >= 0) {
    console.log("user controller had an xed");
    this.currentUser.xedMovies.splice(this.currentUser.oedMovies.indexOf(confession), 1);
  } else if (this.currentUser.oedMovies.indexOf(confession) >= 0) {
    console.log("user controller had an oed");
    this.currentUser.oedMovies.splice(this.currentUser.oedMovies.indexOf(confession), 1);
  }
  return
}
module.exports = new User();
