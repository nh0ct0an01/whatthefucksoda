var express = require('express');
var path = require('path');
//var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var admin = require('./routes/admin');
var user = require('./user');
var app = express();

var User = require('./Model/User');

// view engine setup

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

var userAuth = function(req, res, next) {
    if (req.url.match(/^\/u\//)) {
        var username = req.cookies.username;
        var token = req.cookies.token;
        User.findOne({username: username}, 'token', function(err, user) {
            if (err) {
                res.cookie('username', '', { expires: new Date() });
                res.cookie('token', '', { expires: new Date() });
                res.redirect('/Login');
                console.log(err);
            } else if (!user || user.token != token) {
                res.cookie('username', '', { expires: new Date() });
                res.cookie('token', '', { expires: new Date() });
                res.redirect('/Login');
            } else {
                req.body.username = username;
                next();
            }
        });
    }
    else next();
};
app.use(userAuth);

app.use('/', user);
app.use('/', index);
app.use('/admin', admin);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
