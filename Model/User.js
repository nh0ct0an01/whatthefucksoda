var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
var async = require('async');

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
  /*
  BTCWallet: {
    token: String,
    name: String,
    addresses: [String],
    private: String,
    public: String,
    address: String,
    wif: String,
  },
  ETHWallet: {
    token: String,
    name: String,
    addresses: [String],
    private: String,
    public: String,
    address: String,
    wif: String,
  },
  */
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
      user.balanceBTC = 0;
      user.balanceETH = 0;
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
    callback(err, {users: users});
  });
};

module.exports = mongoose.model('User', UserSchema);
