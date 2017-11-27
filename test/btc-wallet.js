var bcypher = require('blockcypher');

function CreateBTCWallet(name, callback) {
  var bcapi = new bcypher('btc','main','d1033f8d51664cd2a1d7e3735cf07f8c');
  bcapi.delWallet(name, function(err) {
    var data = {
      token: 'd1033f8d51664cd2a1d7e3735cf07f8c',
      name: name,
      address: null,
    };
    bcapi.createWallet(data, function(err, res) {
      if (err) return callback(err);
      if (res.error) return callback(res.error);
      bcapi.genAddrWallet(data.name, callback);
    });
  });
};

/*
{ token: 'd1033f8d51664cd2a1d7e3735cf07f8c',
      name: 'test0',
      addresses: [ '1FbQyxFdBcVa1v6UZwitZMyB9aCMcxKHCL' ],
      private: 'e27e6ef967fdefff5eb23cb62fbcb1d89de9793fdf801ff721e4d160557239bd',
      public: '02f1f345054a4eb57a845923692d8d2cdcc7a62f028dc97410bdb479ab175819c4',
      address: '1FbQyxFdBcVa1v6UZwitZMyB9aCMcxKHCL',
      wif: 'L4oz76p9YfKXQYYj3Dkgg1PNRwq42cG47GdS2g4MxmX7rckZ9tHJ' }
{ token: 'd1033f8d51664cd2a1d7e3735cf07f8c',
      name: 'test1',
      addresses: [ '12vGjVB1GjszZePifFzxXwKaCGe3sHpWM3' ],
      private: '5013ec48eb94fd6df77d57694f8f0ba59a4633943e8c8e3870d3ec03770a693b',
      public: '02f26cb51c569bcc5386d336a7f9898718fb62ab8fe9328fe8e135d71ed49cdd66',
      address: '12vGjVB1GjszZePifFzxXwKaCGe3sHpWM3',
      wif: 'KyuNWgDmfUhsv9oTWyQJDGaWd5fhb1D9f6uVsZTFHuH6TYMdFQjy' }
*/
