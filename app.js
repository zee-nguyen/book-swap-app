var express = require('express'),
		app = express(),
		mongoose = require('mongoose')
		bodyParser = require('body-parser'),
		Book = require('./models/book');

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));

//Setup Mongoose connection
var dev_db_url = 'mongodb://admin:123adminbookswap123@ds041678.mlab.com:41678/book-swap';
var mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// ===========================================
// CREATE SAMPLE DB
// Book.create({
// 	title: 'Four',
// 	thumbnail: 'https://i.pinimg.com/564x/21/12/c3/2112c3ee032788a5968d8a81e2f5724f.jpg',
// 	summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus vel neque neque. Praesent pellentesque velit vitae dolor ornare, ut lobortis nunc semper. Duis ac dui mi. Suspendisse potenti. Maecenas turpis nulla, fringilla sit amet lobortis a, consequat bibendum diam. Donec sed nisi porttitor, pretium mauris at, gravida nibh.'
// })
// .then(function(newBook) {
// 	console.log("newly created book!");
// 	console.log(newBook);
// })
// .catch(function(err) {
// 	console.log(err)
// });


// ===========================================

//Landing page
app.get('/', function(req, res) {
	res.render('index');
});

//Display all books for swap
app.get('/books', function(req, res) {
	//get all books from db
	Book.find({})
	.then(function(allBooks) {
		res.render('books', {books: allBooks});
	})
	.catch(function(err) {
		console.log(err);
	})
});

//NEW - get form to create new book
app.get('/books/new', function(req, res) {
	res.render('new');
})

//CREATE - post new book to db
app.post('/books', function(req, res) {
	//get data from form and add to book array
	var book = { title: req.body.title, summary: req.body.summary, image: req.body.thumbnail };
	Book.create(book)
	.then(function(newBook) {
		res.redirect('/books');
	})
	.catch(function(err) {
		console.log(err);
	});
});


app.listen('8888', () => console.log('magic seriously is happening on port 8888'));
