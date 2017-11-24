var express = require('express');
var router = express.Router();
var User = require("../Model/User");

router.get('/', function(req, res, next) {
    res.redirect('/u/Dashboard');
});

router.get('/Login', function(req, res, next) {
    res.render('pages/Login');
});

router.get('/u/Dashboard', function(req, res, next) {
  res.render('pages/Dashboard');
});

router.get('/u/Exchange', function(req, res, next) {
  res.render('pages/Exchange');
});

router.get('/u/Wallet', function(req, res, next) {
  res.render('pages/Wallet');
});

router.get('/u/Transaction', function(req, res, next) {
  res.render('pages/Transaction');
});

router.get('/u/Team', function(req, res, next) {
  res.render('pages/Team');
});

router.get('/u/Settings', function(req, res, next) {
    res.render('pages/Settings');
    /*
  res.render('pages/Settings', User.getInfo(req.username));
    User.getInfo(username, function(err, info) {
        if (err) next(err);
        else {
            req.render('pages/Setting', info);
        }
    });
    */
});

router.get('/u/Tools', function(req, res, next) {
  res.render('pages/Tools');
});

router.get('/u/Logout', function(req, res, next) {
  res.render('pages/Logout');
});

router.get('/Signup', function(req, res, next) {
  res.render('pages/Signup');
});

module.exports = router;
