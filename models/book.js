var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var BookSchema = new Schema({
	title: String,
	author: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Author'
	},
	summary: String,
	isbn: String,
	genre: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Genre'
	},
	thumbnail: String,
	owner: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User'
		},
		username: String
	},
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Comment'
		}
	]
});

//Virtual for book's URL
BookSchema
.virtual('url')
.get(function() {
	return '/books/' + this._id;
});

module.exports = mongoose.model('Book', BookSchema);
