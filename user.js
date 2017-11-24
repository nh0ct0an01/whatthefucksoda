var express = require('express');
var router = express.Router();
var User = require('./Model/User');
var bcrypt = require('bcrypt');

// TODO refactor: move function to User model

router.post('/create-user', function(req, res, next) {
    // TODO check for duplicated username
    // TODO check for duplicated email
    // TODO check password length,...
    // TODO check phone
    // TODO add new user to team
    // TODO generate random token
    var body = req.body;
    User.findOne({username: body.referer}, "referers", function(err, user) {
        var referer = [];
        if (err) next(err);
        else if (user==null) {}
        else {
            referer = [body.referer].concat(user.referers);
        }
        User.create({
            username: body.username,
            password: body.password,
            email: body.email,
            fullName: body.fullName,
            phone: body.phone,
            countryId: body.countryId,
            referers: referer,
            token: body.username,
            level: referer.length,
        }, function(err) {
            if (err) next(err);
            else res.redirect("/");
        });
    });
});

router.post('/login', function(req, res, next) {
    var body = req.body;
    User.findOne({username: body.username}, "password token", function(err, user) {
        if (err) next(err);
        else if (user==null) {
            res.redirect('/Login');
        }
        else if (bcrypt.compareSync(body.password, user.password)) {
            // TODO exprire day
            res.cookie('username', body.username);
            res.cookie('token', user.token);
            res.redirect('/u/Dashboard');
        }
        else {
            res.redirect('/Login');
        }
    });
});

router.post('/update-user', function(req, res, next) {
    var body = req.body;
    User.update({username: body.username}, {
        fullName: body.fullName,
        phone: body.phone,
        countryId: body.countryId,
    }, function(err, cb) {
        if (err) next(err);
        else {
            res.redirect('/u/Settings');
        }
    })
});

module.exports = router;
