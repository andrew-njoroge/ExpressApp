// index.js

//.......................................Required External Modules................................................
const express = require('express');
const path = require('path');
const session = require('express-session');
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer();
//This is where the routes folder conneccts to the app.js folder
var indexRouter = require('./routes/index');
var blogsRouter = require('./routes/blogs');
var usersRouter = require('./routes/users');
var eventsRouter = require('./routes/events');
var aboutRouter = require('./routes/about');

//..........................................App Variables.........................................................
const app = express();
const MongoDBURI = process.env.MONGO_URI || 'mongodb://localhost/my_database';
const port = process.env.PORT || 8000;

//.....................................Set up mongoose connection...................................................
const mongoose = require('mongoose');
//const MongoStore = require('connect-mongo')(session);
      //var mongoDB = 'mongodb://127.0.0.1/my_database';
      //mongoose.connect(mongoDB, { useNewUrlParser: true , useUnifiedTopology: true});
mongoose.connect(MongoDBURI, { useUnifiedTopology: true, useNewUrlParser: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
});

// .................................................App Configuration...............................................
//creating a path to templates
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

//creating a path to static files
app.use(express.static(path.join(__dirname, "public")));

// for parsing application/json
app.use(express.json()); 

// for parsing application/xwww-  form-urlencoded
app.use(express.urlencoded({ extended: true })); 

// for parsing multipart/form-data
app.use(upload.array()); 

//to set up an express session
app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false,
  /*store: new MongoStore({
    mongooseConnection: db
  })*/
}));



//............................................... Routes Definitions.............................................

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/events', eventsRouter);
app.use('/blogs', blogsRouter);
app.use('/about', aboutRouter);

//.................................................Error handling..................................................
// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

// error handler
// define as the last app.use callback
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send(err.message);
});

//................................................Server Activation...............................................
 app.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`);
  });