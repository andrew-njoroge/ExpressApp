var express = require('express');
var router = express.Router();
const { body, validationResult } = require("express-validator");
var async = require('async');

// Require model modules.
var blogModel = require('../models/blogmodel');
var userModel = require('../models/usermodel');


// ...................................AUTHOR ROUTES .......................................................//
/*
// GET request for creating a author. NOTE This must come before routes that display author (uses id).
router.get('/authors/create', authorModelController.authorCreateGet);

// POST request for creating author.
router.post('/authors/create', authorModelController.authorCreatePost);
*/

// GET request for list of all author items.
router.get('/authors', 
function(req, res) {
    /*this function will access the author collection in the databse, retrieve all author
    and display all author's details. */
    userModel.find()
    .exec(function(err, result){
        if (err){console.log('There has been an error in reading the authors list')};
        console.log(result);
        res.render('authors', {title: 'SEES BLOG AUTHORS', list: result})
    });
}
);

// GET request for one author.
router.get('/authors/:id', 
function(req, res) {
    /*this function will access the author collection in the databse, retrieve the author
    with the id read from the url: req.params.id then display that author's details. */
    async.parallel({
        author: function(callback) {
            userModel.findById(req.params.id)
              .exec(callback)
        },
        author_blogs: function(callback) {
          blogModel.find({ 'author': req.params.id },'title time blog')
          .exec(callback)
        },
    }, function(err, results) {
        /*if (err) { return next(err); } // Error in API usage.
        if (results.author==null) { // No results.
            var err = new Error('Author not found');
            err.status = 404;
            return next(err);
        }*/
        // Successful, so render.
        res.render('author_page', {title: 'Author', author: results.author, author_blogs: results.author_blogs } );
    });

}
);

// GET request to update author.
router.get('/authors/:id/update', 
function(req, res){
    /*this function will query author collection in the database using the
    author id in the url, and update the selected field.*/
    res.send ('This function is still under constructuion.');
}
);

// POST request to update author.
router.post('/authors/:id/update', 
function(req, res) {
    /*am not sure of the difference between post and get*/
    res.send ('This function is still under constructuion.');
}
);

// GET request to delete author.
router.get('/authors/:id/delete', 
function(req, res) {
    /*this function will query author collection in the database using the
    author id in the url, and update the selected field.*/
    res.send('This function is still under constructuion.');
}
);

// POST request to delete author.
router.post('/authors/:id/delete', 
function(req, res) {
    /*am not sure of the difference between post and get*/
    res.send('This function is still under constructuion.');
}
);

// ............................BLOG ROUTES ................................................//
// GET request for creating a blog. NOTE This must come before routes that display blog (uses id).
router.get('/create', 
function(req, res){
    
    /*this function will create a blog collection in the database through the blogModel 
    thats been created from the imported module. In the GET case the form is empty*/
    res.render("blog_form.pug");
    }
);

//POST request for creating blog
router.post('/create', 
    [
    /*In the POST case the user has previously entered invalid data. In 
    the blog variable we pass back a sanitized version of the entered data
    and in the errors variable we pass back an array of error messages.*/

    // Validate and santize the field.
    //body('blog_title', 'Blog title is required').trim().isLength({ min: 1 }).escape(),

    //body('blog', 'Blog is required').trim().isLength({ min: 10 }).escape(),
    
    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        console.log(req.body);
        console.log(Date.now());
        // Create a blog object with escaped and trimmed data.
        var blog = new blogModel({ 
            author: req.body.blogger_name,
            title: req.body.blog_title,
            blog: JSON.stringify(req.body.blog),
            color: req.body.theme_color,
            time: Date.now()
        });
        
        if (!errors.isEmpty()) {
        // There are errors. Render the form again with sanitized values/error messages.
            res.render('blog_form', { blog: blog, errors: errors.array()});
            return;
        }
        else {
            // Data from form is valid.
            // Check if Genre with same name already exists.
            blogModel.findOne({'title': req.body.blog_title })
            .exec( function(err, similar_title_found) {
                if (err) { return next(err); } 
                if (similar_title_found) {
                    // Title exists, redirect to its detail page.
                    res.redirect(similar_title_found.url);
                }
                else {
                    blog.save(function (err) {
                        if (err) { return next(err); }
                        // Genre saved. Redirect to blogs detail page.
                        res.redirect('/blogs');
                    });
                }
            });
        }

    }
]

);

// GET request for list of all blog items.
router.get('/', 
function(req, res) {
    /*this function will access the Blogs collection in the databse, retrieve all blogs
    and display all blog's details. */
    /*
    blogModel.find({}, 'title author')
    .sort({title : 1})
    .populate('author')
    .exec(function (err, list_blogs) {
      //if (err) { return next(err); }
      //Successful, so render
      
    });
    */
   console.log(req.sessionID)
   if (req.session.userId) {
    blogModel.find()
    .exec( function (err, result) {
        //if (err) return handleError(err);
        res.render('blogs_list', { title: 'SEES BLOGS', list: result });
      });
   }
   else {
       res.send('You need to be logged in to access this page');
   }

    }
);

// GET request for one blog.
router.get('/:id', 
function(req, res, next) {
    /*this function will access the Blogs collection in the databse, retrieve the blog
    with the id read from the url: req.params.id then display that blog's details. */
    blogModel.findById(req.params.id)
    .exec( function (err, result){
        if (err) { return next(err); }
        if (result==null) { // No results.
            var err = new Error('Blog not found');
            err.status = 404;
            return next(err);
        }
        //else, the blog has been queried successfully
        res.render('blog_page', {title: result.title, blog: result.blog, date: result.time, about_author: result.author.about_author, author: result.author});
    });
}
);

// GET request to update blog.
router.get('/:id/update', 
function(req, res){
    /*this function will query blog collection in the database using the
    blog id in the url, and update the selected field.*/
    res.send ('This function is still under constructuion.');
}
);

// POST request to update blog.
router.post('/:id/update', 
function(req, res) {
    /*am not sure of the difference between post and get*/
    res.send ('This function is still under constructuion.');
}
);

// GET request to delete blog.
router.get('/:id/delete', 
function(req, res) {
    /*this function will query blog collection in the database using the
    blog id in the url, and update the selected field.*/
    res.send('This function is still under constructuion.');
}
);

// POST request to delete blog.
router.post('/:id/delete', 
function(req, res) {
    /*am not sure of the difference between post and get*/
    res.send('This function is still under constructuion.');
}
);

module.exports = router;