# Musicoin Blockchain Explorer

<b>Live (staging) Version: [Orbiter.Musicoin.org](http://orbiter.musicoin.org)</b>

## Local installation
Clone the repo, and download [Nodejs and npm](https://docs.npmjs.com/getting-started/installing-node "Nodejs install") if you don't have them

Install dependencies:

`npm install`

Install mongodb:

`sudo apt-get install -y mongodb-org`  [mongodb](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/)

## Running Up Parity

Orbiter needs Pairty to trace the internal transactions on Musicoin blockchain. Download [Parity](https://github.com/paritytech/parity/releases/latest) then run a private chain up with:

`parity --chain mus.json --tracing on --dapps-port 8848`

the newest version of chain spec of Musicoin can be found [here](https://github.com/Musicoin/orbiter/blob/master/mc.json).

## Populate the DB
### Run:

`node ./tools/catch.js`

It may take a while to update all history data from blockchain depends on how far you are from the most recent blocks. After the populating, you may run up listen.js to keep sync with the most recent chains. We suggest using "forever" method:

```
sudo npm install -g forever
forever start catch.js
```
Leave this running in the background to continuously fetch new blocks. Now you can start Orbiter with:

`node app.js`  


## License

MIT  (By following http://github.com/ethereumproject/explorer)
