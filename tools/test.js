require( '../db.js' );
require('../db-internal.js')

var express = require('express');
var app = express();

var fs = require('fs');

var Web3 = require('web3');
var http = require('http');


var mongoose = require( 'mongoose' );
var Block       = mongoose.model( 'Block' );
var Transaction = mongoose.model( 'Transaction' );
var InternalTx  = mongoose.model( 'InternalTransaction' );

var listenBlocks = function(config, web3) {
    var newBlocks = web3.eth.filter("latest");
    newBlocks.watch(function (error, log) {

        if(error) {
            console.log('Error: ' + error);
        } else if (log == null) {
            console.log('Warning: null block hash');
        } else {
            grabBlock(config, web3, log);
        }

    });
}

var watchBlocks = function(web3) {
  web3.eth.isSyncing(function(error, sync){
      if(!error) {
          // stop all app activity
          if(sync === true) {
             // we use `true`, so it stops all filters, but not the web3.eth.syncing polling
             web3.reset(true);

          // show sync info
          } else if(sync) {
             console.log(sync.currentBlock);

          // re-gain app operation
          } else {
              // run your app init function...
          }
      }
  });
}


var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

watchBlocks(web3);
