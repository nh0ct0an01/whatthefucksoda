var bcypher = require('blockcypher');
var bcapi = new bcypher('btc','main','d1033f8d51664cd2a1d7e3735cf07f8c');
var bitcoin = require("bitcoinjs-lib");
var bigi    = require("bigi");
var buffer  = require('buffer');
var keys    = new bitcoin.ECPair(bigi.fromHex('c3a5807e27a70c87a61f1ebba43f6b93fd82e5a0ba45311dfef9d050b28b7af3'));

var history = String;
var tosign = String;
function printResponse(err, data) {
};

function ReturnHistory(err, data)
{
  if (err !== null) {
    console.log(err);
  } else {
    history= data;
    console.log(history);
  }
};

var tx = {
  inputs: [{addresses: ['1ARKYdBNWAP2qa5KucCRk9yS8nrFzcA3cp']}],
  outputs: [{addresses: ['1NxPAoL6CRB7TeTsggRaE3pLVAxxsrTSkn'], value: 100}]
};

bcapi.newTX(tx, function(err, data) {
  if (err !== null) {
    console.log(err);
  } else {
    tmptx= data;
    console.log(data);
    tmptx.pubkeys = [];
    tmptx.signatures = tmptx.tosign.map(function(tosign, n) {
      tmptx.pubkeys.push(keys.getPublicKeyBuffer().toString("hex"));
      return keys.sign(new buffer.Buffer(tosign, "hex")).toDER().toString("hex");
    });
    bcapi.sendTX(tmptx,ReturnHistory);
  }
});
