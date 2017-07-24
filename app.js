#!/usr/bin/env node
require('./db');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
const redirectHttps = require('redirect-https');
var fs = require ('fs');
var https = require('https');
var http = require('http');
var helmet = require ('helmet');
var app = express();
app.set('port', process.env.PORT || 3000);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(helmet());
// app libraries
global.__lib = __dirname + '/lib/';
// client
app.get('/', function(req, res) {
  res.render('index');
});
require('./routes')(app);
// let angular catch them
app.use(function(req, res) {
  res.render('index');
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}


// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


http.createServer(function(req, res) {
        res.writeHead(301, {"Location": "https://" + req.headers['host'] + req.url});
        res.end();
}).listen(80);

https.createServer({
    key: fs.readFileSync("/etc/letsencrypt/live/orbiter.musicoin.org/privkey.pem"),
    cert: fs.readFileSync("/etc/letsencrypt/live/orbiter.musicoin.org/fullchain.pem"),
    ca: fs.readFileSync("/etc/letsencrypt/live/orbiter.musicoin.org/chain.pem")
}, app).listen(443);
