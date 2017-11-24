var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('pages/Login')
});

router.get('/Dashboard', function(req, res, next) {
  res.render('pages/Dashboard');
});

router.get('/Exchange', function(req, res, next) {
  res.render('pages/Exchange');
});

router.get('/Lending', function(req, res, next) {
  res.render('pages/Lending');
});

router.get('/Wallet', function(req, res, next) {
  res.render('pages/Wallet');
});

router.get('/Transaction', function(req, res, next) {
  res.render('pages/Transaction');
});

router.get('/Team', function(req, res, next) {
  res.render('pages/Team');
});

router.get('/Settings', function(req, res, next) {
  res.render('pages/Settings');
});

router.get('/Tools', function(req, res, next) {
  res.render('pages/Tools');
});

router.get('/Logout', function(req, res, next) {
  res.render('pages/Logout');
});

router.get('/Signup', function(req, res, next) {
  res.render('pages/Signup');
});

module.exports = router;
