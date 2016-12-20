// define basic functions to read blocks and transations

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


var getTx = function(web3,desiredBlockHashOrNumber) {
      console.log(desiredBlockHashOrNumber);
      if (web3.eth.getBlockTransactionCount(desiredBlockHashOrNumber) > 0) {
        var d =0;
        for (;d <web3.eth.getBlockTransactionCount(desiredBlockHashOrNumber);d++) {
              var txData = web3.eth.getTransactionFromBlock(desiredBlockHashOrNumber,d);
              txData.timestamp = web3.eth.getBlock(desiredBlockHashOrNumber).timestamp;
              new Transaction(txData).save();
              if ( typeof err !== 'undefined' && err ) {
                  if (err.code == 11000) {
                      console.log('Skip: Duplicate key ' +
                      err);
                  } else {
                     console.log('Error: Aborted due to error: ' +
                          err);
                     process.exit(9);
                 }
              } else {
              console.log('DB successfully written for tx ' + txData.hash);
              }
        }
    }
}

function grabInternalTxs(web3, blockHashOrNumber) {

  var fromBlock = web3.toHex(web3.eth.getBlock(blockHashOrNumber).number);
  var toBlock = fromBlock;
  var id = web3.eth.getBlock(blockHashOrNumber).number;
  var post_data = '{ \
    "jsonrpc":"2.0", \
    "method":"trace_filter", \
    "params":[{"fromBlock":"' + fromBlock + '"}], \
    "id":' + id + '}';

  var post_options = {
      host: 'localhost',
      port: '8545',
      path: '/',
      method: 'POST',
      headers: { "Content-Type": "application/json" }
  };

  var post_req = http.request(post_options, function(res) {

      res.setEncoding('utf8');
      var data;
      res.on('data', function (chunk) {
        if (chunk)
            data = chunk;
      });
      res.on('end', function() {
        try {
            var jdata = JSON.parse(data);
        } catch (e) {
            console.error(e);
            batchsize = 10;
            if (batchsize > 1) {
                for (var b=0; b<batchSize; b++) {
                    grabInternalTxs(web3, batchNum+b, 1);
                }
            } else {
                console.error(post_data);
            }
            return
        }
          console.log("\n Here comes itx: " + data);
          for (d in jdata.result) {
            var j = jdata.result[d];
            if (j.action.call)
              j.action = j.action.call;
            else if (j.action.create)
              j.action = j.action.create;
            else if (j.action.suicide)
              j.action = j.action.suicide;

            if (j.action.callType)
              j.action.callType = Object.keys(j.action.callType)[0]
            if (j.result.call)
              j.result = j.result.call;
            else if (j.result.create)
              j.result = j.result.create;
            else if (j.result.suicide)
              j.result = j.result.suicide;
            if (j.action.gas)
              j.action.gas = web3.toDecimal(j.action.gas);
            if (j.result.gasUsed)
              j.result.gasUsed = web3.toDecimal(j.result.gasUsed);
            j.subtraces = web3.toDecimal(j.subtraces);
            j.transactionPosition = web3.toDecimal(j.transactionPosition);
            j.blockNumber = web3.toDecimal(j.blockNumber);
            writeTxToDB(j);
          }
      });
  });
  console.log(post_data);
  post_req.write(post_data);
  post_req.end();

}

var writeTxToDB = function(txData) {
    return InternalTx.findOneAndUpdate(txData, txData, {upsert: true}, function( err, tx ){
        if ( typeof err !== 'undefined' && err ) {
            if (err.code == 11000) {
                console.log('Skip: Duplicate key ' +
                txData.number.toString() + ': ' +
                err);
            } else {
               console.log('Error: Aborted due to error: ' +
                    err);
               process.exit(9);
           }
        } else {
            console.log('DB successfully written for block number ' +
                txData.blockNumber.toString() );
        }
      });
}

var grabBlock = function(config, web3, blockHashOrNumber) {
    var desiredBlockHashOrNumber;

    // check if done
    if(blockHashOrNumber == undefined) {
        return;
    }

    if (typeof blockHashOrNumber === 'object') {
        if('start' in blockHashOrNumber && 'end' in blockHashOrNumber) {
            desiredBlockHashOrNumber = blockHashOrNumber.end;
        }
        else {
            console.log('Error: Aborted becasue found a interval in blocks ' +
                'array that doesn\'t have both a start and end.');
            process.exit(9);
        }
    }
    else {
        desiredBlockHashOrNumber = blockHashOrNumber;
    }

    if(web3.isConnected()) {

        web3.eth.getBlock(desiredBlockHashOrNumber, true, function(error, blockData) {
            if(error) {
                console.log('Warning: error on getting block with hash/number: ' +
                    desiredBlockHashOrNumber + ': ' + error);
            }
            else if(blockData == null) {
                console.log('Warning: null block data received from the block with hash/number: ' +
                    desiredBlockHashOrNumber);
            }
            else {
                getTx(web3, desiredBlockHashOrNumber);
                grabInternalTxs(web3, desiredBlockHashOrNumber);

                if('terminateAtExistingDB' in config && config.terminateAtExistingDB === true) {
                    checkBlockDBExistsThenWrite(config, blockData);
                }
                else {
                  writeBlockToDB(config, blockData);
                }
                if('listenOnly' in config && config.listenOnly === true)
                    return;

                if('hash' in blockData && 'number' in blockData) {
                    // If currently working on an interval (typeof blockHashOrNumber === 'object') and
                    // the block number or block hash just grabbed isn't equal to the start yet:
                    // then grab the parent block number (<this block's number> - 1). Otherwise done
                    // with this interval object (or not currently working on an interval)
                    // -> so move onto the next thing in the blocks array.
                    if(typeof blockHashOrNumber === 'object' &&
                        (
                            (typeof blockHashOrNumber['start'] === 'string' && blockData['hash'] !== blockHashOrNumber['start']) ||
                            (typeof blockHashOrNumber['start'] === 'number' && blockData['number'] > blockHashOrNumber['start'])
                        )
                    ) {
                        blockHashOrNumber['end'] = blockData['number'] - 1;
                        grabBlock(config, web3, blockHashOrNumber);
                    }
                    else {
                        grabBlock(config, web3, config.blocks.pop());
                    }
                }
                else {
                    console.log('Error: No hash or number was found for block: ' + blockHashOrNumber);
                    process.exit(9);
                }
            }
        });
    }
    else {
        console.log('Error: Aborted due to web3 is not connected when trying to ' +
            'get block ' + desiredBlockHashOrNumber);
        process.exit(9);
    }
}


var writeBlockToDB = function(config, blockData) {
    //var blockContents = JSON.stringify(blockData, null, 4);
    return new Block(blockData).save( function( err, block, count ){
        if ( typeof err !== 'undefined' && err ) {
            if (err.code == 11000) {
                console.log('Skip: Duplicate key ' +
                blockData.number.toString() + ': ' +
                err);
            } else {
               console.log('Error: Aborted due to error on ' +
                    'block number ' + blockData.number.toString() + ': ' +
                    err);
               process.exit(9);
           }
        } else {
            if(!('quiet' in config && config.quiet === true)) {
                console.log('DB successfully written for block number ' +
                    blockData.number.toString() );
            }
        }
      });
}

/**
  * Checks if the a record exists for the block number then ->
  *     if record exists: abort
  *     if record DNE: write a file for the block
  */
var checkBlockDBExistsThenWrite = function(config, blockData) {
    Block.find({number: blockData.number}, function (err, b) {
        if (!b.length)
            writeBlockToDB(config, blockData);
        else {
            console.log('Aborting because block number: ' + blockData.number.toString() +
                ' already exists in DB.');
            process.exit(9);
        }

    })
}
