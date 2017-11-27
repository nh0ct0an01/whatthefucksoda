var bcypher = require('blockcypher');

var bcapi = new bcypher('btc', 'main', 'd1033f8d51664cd2a1d7e3735cf07f8c');

bcapi.delWallet('user0', function(err, res) {
  console.log(err, res);
});
bcapi.delWallet('user1', function(err, res) {
  console.log(err, res);
});
bcapi.delWallet('user2', function(err, res) {
  console.log(err, res);
});
bcapi.delWallet('user3', function(err, res) {
  console.log(err, res);
});
