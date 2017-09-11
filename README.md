# Musicoin Blockchain Explorer

![badge](https://img.shields.io/badge/License-MIT-blue.svg)

**Live (staging) Version: [orbiter.musicoin.org](https://orbiter.musicoin.org)**

## Local installation

Clone the repo, and download [Nodejs and npm](https://docs.npmjs.com/getting-started/installing-node "Nodejs install") if you don't have them

Install dependencies: `npm install`

Install mongodb: `sudo apt-get install -y mongodb-org` [mongodb](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/)

## Running Up ~~Parity~~ RMC

Orbiter needs ~~Parity~~RMC to trace the internal transactions on Musicoin blockchain. Download [RMC](https://github.com/immartian/rmc/releases/tag/V0.1.0t) and run a private chain:

`rmc --chain rmc.json --tracing on --dapps-port 8848`

~~the newest version of the chain spec of Musicoin can be found [here](https://github.com/Musicoin/orbiter/blob/master/mc.json) (for Parity version 1.6+, please use this forked [spec](https://github.com/Musicoin/orbiter/blob/master/mc_parity16.json))~~  The chain spec can be download [here]( https://github.com/immartian/rmc/releases/download/V0.1.0/rmc.json).

## Syncing Blocks

Run `node ./tools/catch.js` to start the `catch` script and listen to blocks. Run using your favorite background script runner (`pm2/forever/daemon`). The example for `pm2` is as follows:

```
sudo npm install -g pm2
pm2 start catch.js
```

Please make sure that you do not spawn multiple instances of `catch` using clustering on `pm2` or similar techniques. This will recored the tx multiple times and cause errors.

After this, you can start Orbiter with: `node app.js`

## License

MIT , similar to [Ethereum](http://github.com/ethereumproject/explorer).
