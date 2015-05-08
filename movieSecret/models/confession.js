var mongoose = require('mongoose');

var confessionSchema = mongoose.Schema({
    confession: {type: String, required: true, default: ''},
    poster: {type: String, required: false, default: ''},
    year: {type: String, required: false, default: ''},
    awards: {type: String, required: false, default: ''},
    imdbID: {type: String, required: false, default: ''},
    xCount: {type: Number, required: false, default: 0},
    oCount: {type: Number, required: false, default: 0}
});
var Confession = mongoose.model('Confession', confessionSchema);

module.exports = Confession;
