
var express = require('express');
var app = express();

var fs = require('fs');

var Web3 = require('web3');
var http = require('http');
//var w3c = require('web3-connector')

function delay(ms) {
    return new Promise(function (resolve, reject) {
        setTimeout(resolve, ms); // (A)
    });
}

var payForever = function() {
    var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

    Promise.resolve()
        .then(() => payToppest(web3))
        .then(() => delay(10000))
        .then(() => payForever())
        .catch((err) => {console.log(err)});
}



var payToppest=function(web3){
  desiredBlockHashOrNumber = "latest";
  if (web3.eth.getBlockTransactionCount(desiredBlockHashOrNumber) > 0) {
        var txData = web3.eth.getTransactionFromBlock(desiredBlockHashOrNumber,0);
        sender ="0xd9b87b28449de9a45560fadace31300fcc50e68b";
        var params = {to: txData.to, from: sender, value:  web3.toWei(1, "ether")};
        web3.personal.unlockAccount(sender, "mybaby", 1000);
        return new Promise(function (resolve,reject){

           web3.eth.sendTransaction(
               params,
               function(err, transactionHash){
                   if(err){
                       reject(err);
                       console.log(err);
                   }else{
                       resolve(transactionHash);
                       console.log(transactionHash);
                   }
               }
           );
       });
  }
}


payForever();
