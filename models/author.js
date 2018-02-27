// var mongoose = require('mongoose');
//
// var Schema = mongoose.Schema;
//
// var AuthorSchema = new Schema({
// 	first_name: {
// 		type: String,
// 		max: 100
// 	},
// 	last_name: {
// 		type: String,
// 		max: 100
// 	},
// 	date_of_birth: {
// 		type: Date
// 	},
// 	date_of_death: {
// 		type: Date
// 	}
// });
//
// //Virtual for author's full name
// AuthorSchema
// .virtual('name')
// .get(function() {
// 	return this.first_name + ' ' + this.last_name;
// });
//
// //Virtual for author's URL
// AuthorSchema
// .virtual('url')
// .get(function() {
// 	return '/books/author/' + this._id;
// });
//
// module.exports = mongoose.model('Author', AuthorSchema);
