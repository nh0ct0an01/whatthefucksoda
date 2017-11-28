var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PacketSchema = new Schema({
  id: String,
  amount: Number, // amount in bitcoin
});

module.exports = mongoose.model('Packet', PacketSchema);
