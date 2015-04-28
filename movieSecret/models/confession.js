var mongoose = require('mongoose');

var confessionSchema = mongoose.Schema({
    post_date: {type: Date, required: true, default: Date.now },
    confession: {type: String, required: true, default: ''},
		user: {type: String, required: true}
});
var Confession = mongoose.model('Confession', confessionSchema);

module.exports = Confession;
