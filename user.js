var express = require('express');
var router = express.Router();
var User = require('./Model/User');
var bcrypt = require('bcrypt');

// TODO refactor: move function to User model

router.post('/create', function(req, res, next) {
    // TODO check for duplicated username
    // TODO check password lenght
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
            res.send({ error: 1 });
        }
        else if (bcrypt.compareSync(body.password, user.password)) {
            res.send({token: user.token});
        }
        else {
            res.send({ error: 1 });
        }
    });
});

module.exports = router;
