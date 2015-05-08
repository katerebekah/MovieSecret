var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    username: {type: String, required: true, default: ''},
    password: {type: String, required: true, default: ''},
    email: {type: String, default: ''},
    confessions: {
    	haventSeen: {type: Array, default:[]}
    },
    xedMovies: {type: Array, default: []},
    oedMovies: {type: Array, default: []}
});

var User = mongoose.model('User', userSchema);

module.exports = User;
