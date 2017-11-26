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
    User.getInfo(req.body.username, function(err, user){
        res.render('pages/Dashboard', user);
    });
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
    User.getInfo(req.body.username, function(err, user){
        res.render('pages/Settings', user);
    });
});

router.get('/u/Tools', function(req, res, next) {
  res.render('pages/Tools');
});

router.get('/u/Logout', function(req, res, next) {
    res.cookie('username', '', { expires: new Date() });
    res.cookie('token', '', { expires: new Date() });
    res.redirect('/Login');
});

router.get('/Signup', function(req, res, next) {
  res.render('pages/Signup');
});

module.exports = router;
