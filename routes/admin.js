var express = require('express');
var router = express.Router();

router.get("/", function(req, res, next) {
  res.redirect('/admin/a/Dashboard');
});

router.get("/a/Dashboard", function(req, res, next) {
  res.render('pages/admin/Dashboard');
});

module.exports = router;
