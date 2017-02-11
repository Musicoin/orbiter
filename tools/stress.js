// this program only works under a strange setting of Geth, not exactly on parity
//   geth --rpc --rpcaddr="0.0.0.0" --rpccorsdomain="*" --rpcapi="db,eth,net,web3,personal,web3"



var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

var counter = 5000;

function payout() {
   web3.personal.unlockAccount('0x13559ecbdbf8c32d6a86c5a277fd1efbc8409b5b',"WMLWbaM5Tcoins");

   web3.eth.sendTransaction({
   from: '0x13559ecbdbf8c32d6a86c5a277fd1efbc8409b5b',
   to: '0x55a00bc3b44e84728091d0a8c80400a08bcb6a43',
   value:  web3.toWei(counter % 3, "ether")});

}

function forever() {
    console.log(counter);

    // create options object here
    //var options = {
    //    host:'www.host.com',
    //    path:'/path/'+counter
    //};
    payout();

    counter--;
    if (counter > 0) {
        setTimeout(forever, 5000);
    }
}

forever();
