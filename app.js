const express 													= require("express"),
		app 																= express(),
		mongoose 														= require("mongoose"),
		passport 														= require("passport"),
		LocalStrategy 											= require("passport-local"),
		passportLocalMongoose 							= require("passport-local-mongoose"),
		session 														= require("express-session"),
		bodyParser 													= require("body-parser"),
		cookieParser 												= require("cookie-parser"),
		methodOverride 											= require("method-override"),
		favicon 														= require("serve-favicon"),
		flash 															= require("connect-flash"),
		validator 													= require("express-validator"),
		Book 																= require("./models/book"),
		User 																= require("./models/user"),
		Comment 														= require("./models/comment"),
		seedDB 															= require("./seeds");


//Require routes
const indexRoutes 	= require("./routes/index"),
			bookRoutes 		= require("./routes/books"),
			commentRoutes = require("./routes/comments"),
			apiRoutes			= require("./routes/api");

//Setup Mongoose connection
var dev_db_url = 'mongodb://admin:123adminbookswap123@ds041678.mlab.com:41678/book-swap';
var mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(favicon(__dirname + "/public/images/favicon.png"));
app.use(validator());

// seedDB();
app.use(cookieParser('secret'));

// Passport configuration
app.use(session({
    secret: "It's snowing today",
    resave: false,
    saveUninitialized: false
}));

// Passport Config
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(flash());

//custom middleware
app.use(function(req, res, next) {
	res.locals.currentUser = req.user;
	res.locals.success = req.flash("success");
	res.locals.error = req.flash("error");
	next();
});

//Use routes
app.use("/", indexRoutes);
app.use("/books", bookRoutes);
app.use("/books/:id/comments", commentRoutes);
app.use("/books/api", apiRoutes);

app.listen('8888', () => console.log('magic seriously is happening on port 8888'));
