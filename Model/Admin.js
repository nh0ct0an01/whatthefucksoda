var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
var async = require('async');

var AdminSchema = new Schema({
  admin: String,
  password: String,
  createAt: {
    type: Date,
    default: Date.now
  },
  token: String,
});

var BTCWallet = new Schema({
  token: String,
  name: String,
  addresses: [String],
  private: String,
  public: String,
  address: String,
  wif: String,
});

ETHAddrs: new Schema({
  token: String,
  private: String,
  public: String,
  address: String,
});
