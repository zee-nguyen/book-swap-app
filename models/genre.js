// var mongoose = require('mongoose');
//
// var Schema = mongoose.Schema;
//
// var GenreSchema = new Schema({
// 	name: {
// 		type: String,
// 		min: 3,
// 		max: 100
// 	}
// });
//
// //virtual for url
// GenreSchema
// .virtual('url')
// .get(function() {
// 	return '/books/genre/' + this._id;
// });
//
// module.exports = mongoose.model('Genre', GenreSchema);
