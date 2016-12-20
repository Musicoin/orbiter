// this program only works under a strange setting of Geth, not exactly on parity
//   geth --rpc --rpcaddr="0.0.0.0" --rpccorsdomain="*" --rpcapi="db,eth,net,web3,personal,web3"



var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

var counter = 5000;

function payout() {
   web3.personal.unlockAccount('0x15b64d20202475b2ef8c8544e743f36eafe7507c',"mybaby");

   web3.eth.sendTransaction({
   from: '0x15b64d20202475b2ef8c8544e743f36eafe7507c',
   to: '0x008d4c913ca41f1f8d73b43d8fa536da423f1fb4',
   value:  web3.toWei(counter % 10, "ether")});

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
        setTimeout(forever, 3000);
    }
}

forever();
