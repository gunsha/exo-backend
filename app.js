var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var mongoose = require('mongoose');
var options = {
  useMongoClient: true,
  reconnectTries: 100, // Never stop trying to reconnect
  reconnectInterval: 500, // Reconnect every 500ms
  poolSize: 10, 
  // If not connected, return errors immediately rather than waiting for reconnect
  bufferMaxEntries: 0
};
// var connection = mongoose.connect('mongodb://parking-backend:m0ng0p4rk1ng@ds117758.mlab.com:17758/parking',options);

var jwt = require('express-jwt');

var users = require('./routes/user');
var tachas = require('./routes/tacha');

var app = express();

var tokenSecret = 'shhhhhhared-secret';

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With");
      res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
      if ('OPTIONS' === req.method) {
          res.status(204).send();
      }
      else {
          next();
      }
  });

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());


app.use(jwt({ secret: tokenSecret}));
app.use('/users', users);
app.use('/parkings', tachas);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  // development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
      res
      .status(err.status || 500)
      .json({
        message: err.message,
        error: err
      });
    });
  }
  
  // production error handler
  // no stacktraces leaked to user
  app.use(function(err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
    res.status(401).send('invalid token...');
  }
    res
    .status(err.status || 500)
    .json({
      message: err.message,
      error: err
    });
  });
  
  
  module.exports = app;