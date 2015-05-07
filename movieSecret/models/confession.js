var mongoose = require('mongoose');

var confessionSchema = mongoose.Schema({
    post_date: {type: Date, required: true, default: Date.now },
    confession: {type: String, required: true, default: ''},
    poster: {type: String, required: false, default: ''},
    year: {type: String, required: false, default: ''},
    awards: {type: String, required: false, default: ''},
		user: {type: String, required: true}
});
var Confession = mongoose.model('Confession', confessionSchema);

module.exports = Confession;
