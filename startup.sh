#! /bin/bash

apt update
apt -y upgrade
apt-get install -y build-essential
apt install -y nodejs
apt install -y nodejs-legacy
apt install -y npm
npm install forever -g
apt install -y mongodb-server
mkdir musicoin
cd musicoin
wget http://d1h4xl4cr1h0mo.cloudfront.net/v1.5.2/x86_64-unknown-linux-gnu/parity_1.5.2_amd64.deb
dpkg -i parity_1.5.2_amd64.deb
rm  parity_1.5.2_amd64.deb

git clone https://github.com/Musicoin/orbiter.git
cd orbiter
parity --chain mc.json --tracing on &
export PORT=80
npm install
pm2 start ./tools/catch.js
pm2 start app.js
