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

var watchBlocks = function(config, web3) {
    var newBlocks = web3.eth.filter("latest");
    newBlocks.isSynching(function (error, log) {

        if(error) {
            console.log('Error: ' + error);
        } else if (log == null) {
            console.log('Warning: null block hash');
        } else {
            console(config, web3, log);
        }

    });
}


var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545');
watchBlocks(config, web3);
