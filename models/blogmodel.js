//Import the mongoose module
var mongoose = require('mongoose');

/*
//Set up default mongoose connection
var mongoDB = 'mongodb://127.0.0.1/my_database';
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});

//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
*/

//define a schema: use the Schema constructor to create a new schema instance, defining the various fields inside it in the constructor's object parameter.
var schema = mongoose.Schema;

//setting a blog table(collection) schema
var blogSchema = new schema ({
    author: {type: String, required: true}, //{type: schema.Types.ObjectId, ref: 'blog_authors', required: true},
    title: {type: String, required: true},
    blog: {type: String, required: true},
    color: {type: String, default: '#00ffff'},
    time: {type: Date, default: Date.now()}
},

);

// Virtual for bloginstance's URL
blogSchema
.virtual('url')
.get(function () {
  return '/blogs/' + this._id;
});

//creating a model for blog schema and setting it as a module that can be accessed by other modules
module.exports = mongoose.model('blogs', blogSchema);

/*
...//to create a model to be used here, do:
blogModel = mongoose.model('name of Collection', pass_the_schema_to_be_modeled);
...//create an instance of blog Model
var blog = new blogModel ({author: 'Steph', about_author: 'I am hungry', blog: 'I am trying to make this work', color: '#000000', date: Date()});
...//Save the new model instance, passing a callback
blog.save(function (err) {
    if (err) return handleError(err);
    // saved!
  }); 
...//to query the database:
  blogModel.find({ 'author': 'Steph' }, 'about_author blog', function (err, result) {
    if (err) return handleError(err);
    console.log(result);
  });

  */