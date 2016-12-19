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

## Populate the DB
### Run:

`node ./tools/listen.js`

Leave this running in the background to continuously fetch new blocks. There will be 2 modes which will be divided into separate scripts: listening mode and patching mode, temporarily set in config.json.
