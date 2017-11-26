var express = require('express');
var router = express.Router();
var User = require('./Model/User');
var bcrypt = require('bcrypt');
bcypher = require('blockcypher');

var bcapi = new bcypher('btc','main','d1033f8d51664cd2a1d7e3735cf07f8c');
var ethcapi = new bcypher('eth','main','d1033f8d51664cd2a1d7e3735cf07f8c');

var KeyJson = {
    private : String,
    public : String,
    address : String,
    wif : String,
};
var WalletInfo = {
    token: String,
    name: String,
};
var RBalance = String;
var Wallet = function (err, data) {
    if (err !== null) {
        console.log(err);
    } else {
        WalletInfo= data;    
    }
};
function ReturnBalance(err, data) {
    if (err !== null) {
        console.log(err);
    } else {
        RBalance= data.balance;

    }
};

var param= {
    unspentOnly: 1,
    includeScript:1,
    includeConfidence: 1,
    before : 1,
    after: 1,
    limit: 1,
    confirmations:1,
    confidence : 1,
    omitWalletAddresses:1,
};

// TODO refactor: move function to User model

router.post('/create-user', function(req, res, next) {
    // TODO check for duplicated username
    // TODO check for duplicated email
    // TODO check password length,...
    // TODO check phone
    // TODO add new user to team
    // TODO generate random token
    var body = req.body;
    var NewDesign = {
        token: 'd1033f8d51664cd2a1d7e3735cf07f8c',
        name: body.username,
        addresses: null,
    };
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
        },

            bcapi.createWallet(NewDesign,Wallet), // tao vi btc
            bcapi.genAddrWallet(NewDesign.name,printJson), // tao dia chi vi btc 
            Key_Private_BTC=KeyJson.private, // Chuyen key private btc
            Key_Public_BTC= KeyJson.public,
            wif_BTC=KeyJson.wif,
            BTCAdress= KeyJson.address,
            bcapi.getAddrBal(KeyJson.address,param,ReturnBalance),
            balanceBTC= ReturnBalance.RBalance,

            ethcapi.createWallet(NewDesign,Wallet), // tao vi eth
            ethcapi.genAddrWallet(NewDesign.name,printJson), // tao dia chi vi eth
            Key_Private_ETH= KeyJson.private,
            Key_Public_ETH= KeyJson.public,
            wif_ETH=KeyJson.wif,
            ETHAdress= KeyJson.address,
            ethcapi.getAddrBal(KeyJson.address,param,ReturnBalance),
            balanceETH= ReturnBalance.RBalance,

            function(err) {
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

// TODO check if update is success

router.post('/u/update-user', function(req, res, next) {
    var body = req.body;
    User.update({username: body.username}, {
        fullName: body.fullName,
        phone: body.phone,
        countryId: body.countryId,
    }, function(err) {
        if (err) next(err);
        else {
            res.redirect('/u/Settings');
        }
    })
});

router.post('/u/change-password', function(req, res, next) {
    var body = req.body;
    User.findOne({username: body.username}, 'password', function(err, user) {
        if (err) {
            next(err);
            return;
        }
        if (!user) {
            console.log("?? :D ??");
            return;
        }
        if (bcrypt.compareSync(body.oldpass, user.password)) {
            var hash = bcrypt.hashSync(body.newpass, 10);
            User.update({username: body.username}, { password: hash }, function(err) {
                if (err) next(err);
                else {
                    res.redirect('/u/Logout');
                }
            });
        }
    });
});

router.post('/buy', function(req, res, next) {
    var body = req.body;
    User.addACB(body.username, parseFloat(body.amount), parseFloat(body.rate), function(err) {
        if (err) next(err);
        else {
            User.find({}, 'username balanceABC', function(err, users) {
                console.log(users);
                if (err) next(err);
                else {
                    var str = '';
                    users.forEach(function(user) { str += user.username + ' ' + user.balanceABC + "\n"});
                    res.send(str);
                }
            });
        }
    });
})

module.exports = router;
