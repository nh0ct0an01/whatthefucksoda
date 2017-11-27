var bcypher = require('blockcypher');

function CreateETHAddr(name, callback) {
  var ethapi = new bcypher('eth','main','d1033f8d51664cd2a1d7e3735cf07f8c');
  var data = {
    token: 'd1033f8d51664cd2a1d7e3735cf07f8c',
    name: name,
    address: null,
  };
  ethapi.genAddr(data, callback);
};

CreateETHAddr('user0', function(err, res) {
  console.log(err, res);
});
