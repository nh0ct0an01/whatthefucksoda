var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SendReqSchema = new Schema({
  username: String,
  type: String,
  amount: Number,
});

module.exports = mongoose.model('SendReq', SendReqSchema);
