var express = require('express');
var router = express.Router();

router.get("/", function(req, res, next) {
  res.render('pages/admin/admin_at_a_glance');
});

module.exports = router;
