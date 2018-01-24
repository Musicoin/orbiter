## Orbiter has archived in favour of explorer now.

# Musicoin Blockchain Explorer

![badge](https://img.shields.io/badge/License-MIT-blue.svg)

[Explorer 1](https://explorer.musicoin.org) running on parity

## Local installation

Clone the repo, and download [Nodejs and npm](https://docs.npmjs.com/getting-started/installing-node "Nodejs install") if you don't have them

Install dependencies: `npm install`

Install [mongodb](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/): `sudo apt-get install -y mongodb-org`

## Running Up RMC

Orbiter needs RMC to trace the internal transactions on Musicoin blockchain. Download [RMC](https://github.com/immartian/rmc/releases/tag/V0.1.0) and run a private chain:

`./rmc --chain rmc.json  --port 3304 --tracing on --jsonrpc-port 8545`

The chain spec can be download [here]( https://github.com/immartian/rmc/releases/download/V0.1.0/rmc.json).

## Syncing Blocks

Run `node ./tools/catch.js` to start the `catch` script and listen to blocks. Run using your favorite background script runner (`pm2/forever/daemon`). The example for `pm2` is as follows:

```
sudo npm install -g pm2
pm2 start catch.js
```

Please make sure that you do not spawn multiple instances of `catch` using clustering on `pm2` or similar techniques. This will recored the tx multiple times and cause errors.

After this, you can start Orbiter with: `node app.js` (or `pm2 start app.js`)


## Running with parity

All Parity versions above 1.8.0 are compatible with Musicoin. For setting up an explorer with Parity, check out [explorer](https://github.com/seungjlee/MusicoinExplorer).

## License

MIT , similar to [Ethereum Classis](http://github.com/ethereumproject/explorer).
