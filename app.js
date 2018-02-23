var express = require('express'),
app = express();

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));


//Landing page
app.get('/', function(req, res) {
	res.render('index');
});

//Display all books for swap
app.get('/books', function(req, res) {
	res.render('all-books');
})


app.listen('8888', () => console.log('magic seriously is happening on port 8888'));
