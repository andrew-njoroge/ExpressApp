var express = require('express');
var router = express.Router();

router.get("/", (req, res) => {
    res.status(200);
    res.render("blog_form.pug");
  });

  module.exports = router;