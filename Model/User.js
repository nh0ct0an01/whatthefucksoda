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
    /*
    team: {
        type: [{id: String}],
        default: [],
    },
    */
    balanceABC: {
        type: Number, 
        default: 0,
    },
    //balanceETH: Double,
    //balanceBTC: Double,
    //BTCAdress: String,
    //ETHAdress: String,
    createAt: {
        type: Date,
        default: Date.now
    },
    token: String,
    //id: String
});

UserSchema.pre('save', function(next) {
    var user = this;
    bcrypt.hash(user.password, 10, function(err, hash) {
        if (err) next(err);
        else {
            user.password = hash;
            next();
        }
    });
});

UserSchema.statics.getInfo = function(username, cb) {
    this.model('User').findOne({username: username}, 'username fullName email countryId phone', function(err, user) {
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
            console.log(addList);
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
