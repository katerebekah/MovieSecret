var mongoose = require('mongoose');

var confessionSchema = mongoose.Schema({
    post_date: {type: Date, required: true, default: Date.now },
    confession: {type: String, required: true, default: ''},
    apiData: {type: Object, required: false},
		user: {type: String, required: true}
});
var Confession = mongoose.model('Confession', confessionSchema);

module.exports = Confession;
