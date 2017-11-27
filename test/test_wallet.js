var bcypher = require('blockcypher');

function CreateETHWallet (name, callback) {
  var ethcapi = new bcypher('eth','main','d1033f8d51664cd2a1d7e3735cf07f8c');
  var data = {
    token: 'd1033f8d51664cd2a1d7e3735cf07f8c',
    name: name,
    address: null,
  };
  ethcapi.createWallet(data, function(err, res) {
    if (err) return callback(err);
    ethcapi.genAddrWallet(data.name, callback);
  });
};

CreateETHWallet('user0', function(err, res) {
  console.log(err);
  console.log(res);
});


function CreateBTCWallet(name, callback) {
  var bcapi = new bcypher('btc','main','d1033f8d51664cd2a1d7e3735cf07f8c');
  var data = {
    token: 'd1033f8d51664cd2a1d7e3735cf07f8c',
    name: name,
    address: null,
  };
  bcapi.createWallet(data, function(err, res) {
  console.log(err);
  console.log(res);
    if (err) return callback(err);
    bcapi.genAddrWallet(data.name, callback);
  });
};

CreateBTCWallet('user0', function(err, res) {
  console.log(err);
  console.log(res);
});
