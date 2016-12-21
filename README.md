# Musicoin Blockchain Explorer

<b>Live (staging) Version: [Orbiter.Musicoin.org](http://orbiter.musicoin.org)</b>

## Local installation
Clone the repo, and download [Nodejs and npm](https://docs.npmjs.com/getting-started/installing-node "Nodejs install") if you don't have them

Install dependencies:

`npm install`

Install mongodb:

`sudo apt-get install -y mongodb-org`  [mongodb](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/)

## Running Up Parity

`parity --chain mus.json --tracing on --dapps-port 8848 d`

the newest version of chain spec of Musicoin can be found [here](https://github.com/Musicoin/rust-musicoin/blob/master/mus.json).

## Populate the DB
### Run:

`node ./tools/patch.js`

It may take a while to update all history data from blockchain depends on how far you are from the most recent blocks. After the populating, you may run up listen.js to keep sync with the most recent chains. We suggest using "forever" method:

```
sudo npm install -g forever
forever start listen.js
```
Leave this running in the background to continuously fetch new blocks.
