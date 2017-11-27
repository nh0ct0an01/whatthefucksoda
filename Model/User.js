var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
var async = require('async');
var formatter = require('../formatter');

var UserSchema = new Schema({
  username: String,
  fullName: String,
  email: String,
  password: String,
  phone: String,
  countryId: Number,
  level: Number,
  referer: String,
  referers: [String],
  team: {
    type: [String],
    default: [],
  },
  balanceACB: {
    type: Number, 
    default: 0,
  },
  BTCWallet: {
    token: String,
    name: String,
    addresses: [String],
    private: String,
    public: String,
    address: String,
    wif: String,
  },
  ETHAddr: {
    token: String,
    private: String,
    public: String,
    address: String,
  },
  createAt: {
    type: Date,
    default: Date.now
  },
  token: String,
});

UserSchema.statics.getInfo = function(username, cb) {
  this.model('User').findOne({username: username},
    'username fullName email countryId phone balanceACB',
    function(err, user) {
      user = JSON.parse(JSON.stringify(user));
      user.balanceBTC = formatter.balance(0);
      user.balanceETH = formatter.balance(0);
      user.balanceACB = formatter.balance(user.balanceACB);
      cb(err, user);
    }
  );
};

UserSchema.statics.addACB = function(username, amount, rate, callback) {
  var User = this.model('User');
  User.findOne({username: username}, 'referers', function(err, user) {
    if (err || !user) {
      // TODO handle when user is not found
      callback(err);
    } else {
      var addList = [username].concat(user.referers).map(function(name) {
        var res = {username: name, amount: amount};
        amount = amount * rate;
        return res;
      });
      // TODO check if update is success
      // TODO only update if amount > 0
      async.each(addList, function(x, cb) {
        User.update({username: x.username},
          {$inc: {balanceACB: x.amount}}, function(err) {
            if (err) cb(err);
            else cb();
          });
      }, function(err) {
        callback(err);
      });
    }
  });
};

UserSchema.statics.getTeam = function(username, callback) {
  var User = this.model('User');
  User.find({referer: username}, 'username balanceACB createAt', function(err, users) {
    users = users.map(function(user) {
      user = JSON.parse(JSON.stringify(user));
      user.balanceACB = formatter.balance(user.balanceACB);
      user.createAt = formatter.date(user.createAt);
      return user;
    });
    callback(err, {users: users});
  });
};

module.exports = mongoose.model('User', UserSchema);
