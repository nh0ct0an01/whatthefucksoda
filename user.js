var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var async = require('async');
var randToken = require('rand-token');
var bcypher = require('blockcypher');
var bitcoin = require("bitcoinjs-lib");
var bigi    = require("bigi");
var buffer  = require('buffer');

var User = require('./Model/User');
var SendReq = require('./Model/SendReq');

function CreateBTCWallet(name, callback) {
  var bcapi = new bcypher('btc','main','d1033f8d51664cd2a1d7e3735cf07f8c');
  var data = {
    token: 'd1033f8d51664cd2a1d7e3735cf07f8c',
    name: name,
    address: null,
  };
  bcapi.createWallet(data, function(err, res) {
    if (err) return callback(err);
    if (res.error) return callback(res.error);
    bcapi.genAddrWallet(data.name, callback);
  });
};

// TODO refactor: move function to User model

router.post('/create-user', function(req, res, next) {
  // TODO check password length,...
  // TODO check phone
  var body = req.body;
  async.parallel([
    function(callback) {
      User.findOne({username: body.username}, "usename", function(err, user) {
        if (!err && user) callback(null, true);
        else callback(null, false);
      });
    },
    function(callback) {
      User.findOne({email: body.email}, "email", function(err, user) {
        if (!err && user) callback(null, true);
        else callback(null, false);
      });
    },
  ], function(err, result) {
    if (!result[0] && !result[1]) {
      // Create user
      User.findOne({username: body.referer}, "referers", function(err, user) {
        var referer = [];
        if (err) next(err);
        else if (user==null) {}
        else {
          referer = [body.referer].concat(user.referers);
        }

        async.parallel([
          function(callback) {
            if (referer.length > 0) {
              User.update({username: referer[0]}, { $push: {team: body.username} }, function(err) {
                if (err) next(err);
                else callback();
              });
            } else {
              callback();
            }
          },
          function(callback) {
            if (err) return callback(err);
            async.parallel([
              function(callback) {
                CreateBTCWallet(body.username, callback);
              },
            ], function(err, res) {
              if (err) next(err);
              User.create({
                username: body.username,
                password: bcrypt.hashSync(body.password, 10),
                email: body.email,
                fullName: body.fullName,
                phone: body.phone,
                countryId: body.countryId,
                referer: body.referer,
                referers: referer,
                token: randToken.generate(64),
                level: referer.length,
                BTCWallet: res[0],
              }, function(err) {
                if (err) next(err);
                else callback();
              });
            });
          }
        ], function() {
          res.redirect("/");
        });
      });
    } else {
      // existed
      res.redirect("/Login")
    }
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
      res.cookie('username', body.username, {maxAge: 172800000, httpOnly: true});
      res.cookie('token', user.token, {maxAge: 172800000, httpOnly: true});
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
      User.find({}, 'username balanceACB', function(err, users) {
        if (err) next(err);
        else {
          var str = '';
          users.forEach(function(user) { str += user.username + ' ' + user.balanceACB + "\n"});
          res.send(str);
        }
      });
    }
  });
});

/*
var send = function(input, output, value, callback) {
  var bcapi = new bcypher('btc','main','d1033f8d51664cd2a1d7e3735cf07f8c');
  var keys  = new bitcoin.ECPair(bigi.fromHex('c3a5807e27a70c87a61f1ebba43f6b93fd82e5a0ba45311dfef9d050b28b7af3'));
  var tx = {
    inputs: [{addresses: ['input']}],
    outputs: [{addresses: ['output'], value: value}]
  };
  bcapi.newTX(tx, function(err, data) {
    if (err) {
      callback(err);
    } else {
      data = JSON.parse(data);
      console.log(data);
      if (data.error !== null) return callback(data.error);
      tmptx= data;
      tmptx.pubkeys = [];
      tmptx.signatures = tmptx.tosign.map(function(tosign, n) {
        tmptx.pubkeys.push(keys.getPublicKeyBuffer().toString("hex"));
        return keys.sign(new buffer.Buffer(tosign, "hex")).toDER().toString("hex");
      });
      bcapi.sendTX(tmptx, callback);
    }
  });
}
*/

router.post('/u/send-btc', function(req, res, next) {
  var body = req.body;

  User.findOne({username: body.username}, "password", function(err, user) {
    if (bcrypt.compareSync(body.password, user.password)) {
      User.getBalance(body.username, function(err, bal) {
        // TODO alert not enough balance
        if (bal.balanceBTC < body.amount) {
        } else {
          // TODO check for error
          SendReqSchema.create({username: body.username, amount: body.amount, type: "BTC"}, function() {});
          User.update({username: username}, {$inc: {UsedBTC: body.amount}}, function() {});
        }
        res.redirect('/u/Wallet');
      });
    } else {
      res.redirect('/u/Wallet');
    }
  })
});

module.exports = router;
