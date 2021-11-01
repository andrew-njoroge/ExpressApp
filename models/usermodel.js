const mongoose = require("mongoose");

var schema = mongoose.Schema;

var authorSchema = new schema({
    unique_id: Number,
    email: String,
    username: String,
    password: String,
    passwordConf: String,
    createdAt: {
      type: Date,
      default: Date.now
    },
    about: String,
    isauthor: Boolean,
    blogs: [{type: schema.Types.ObjectId, ref: 'blogs'}]
});

authorSchema
.virtual('url')
.get(function () {
  return '/blogs/author/' + this._id;
});

module.exports = mongoose.model('blog_authors', authorSchema);