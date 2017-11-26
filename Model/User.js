var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
var async = require('async');

mongoose.Promise = global.Promise;
mongoose.connection.on('disconnected', () => { console.log('-> lost connection'); });
mongoose.connection.on('reconnect', () => { console.log('-> reconnected'); });
mongoose.connection.on('connected', () => { console.log('-> connected'); });
mongoose.connect('mongodb://127.0.0.1:27017/db', {useMongoClient: true});
mongoose.set('debug', true);

var UserSchema = new Schema({
    username: String,
    fullName: String,
    email: String,
    password: String,
    phone: String,
    countryId: Number,
    level: Number,
    referers: [String],
    team: {
        type: [String],
        default: [],
    },
    balanceACB: {
        type: Number, 
        default: 0,
    },
    balanceBTC: {
        type: Number,
        default: 0,
    },
    balanceETH: {
        type: Number,
        default: 0,
    },
    BTCAdress: String,
    BTCKey: String,
    ETHAdress: String,
    ETHKey: String,
    createAt: {
        type: Date,
        default: Date.now
    },
    token: String,
});

UserSchema.statics.getInfo = function(username, cb) {
    this.model('User').findOne({username: username},
        'username fullName email countryId phone balanceACB balanceBTC balanceETH',
        function(err, user) {
            cb(err, user);
        });
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
            async.each(addList, function(x, cb) {
                User.update({username: x.username},
                    {$inc: {balanceABC: x.amount}}, function(err) {
                        if (err) cb(err);
                        else cb();
                    });
            }, function(err) {
                callback(err);
            });
        }
    })
};

module.exports = mongoose.model('User', UserSchema);
