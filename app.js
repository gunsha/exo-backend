var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fallback = require('express-history-api-fallback');
var mongoose = require('mongoose');
var options = {
  useMongoClient: true,
  reconnectTries: 100,
  reconnectInterval: 500,
  poolSize: 10, 
  bufferMaxEntries: 0
};
var connection = mongoose.connect('mongodb://localhost:27017/exonfc',options);

var jwt = require('express-jwt');

var users = require('./routes/user');
var tachas = require('./routes/tacha');
var logs = require('./routes/logger');

var app = express();

var tokenSecret = '3x05m4rt94rk1n6-24725dac549b5d04dd9559f737b8c71daf815b3a033c4b9bd37c18cf20a15b54';

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
var rootPath = __dirname + '/frontend-admin/public_html/'


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
var publicPaths=[
  '/',
  '/api/users/login',
  '/usuarios',
  '/login',
  '/js/app.js',
  '/js/lib.js',
  '/css/app.css',
  '/templates/index.html',
  '/templates/nav.html',
  '/templates/usuarios.html',
  '/templates/login.html',
  '/templates/layout.html',
  '/fonts/glyphicons-halflings-regular.woff2',
  '/webfonts/fa-solid-900.woff2'
];
app.use(jwt({ secret: tokenSecret}).unless({path:publicPaths}));
app.use('/api/users', users);
app.use('/api/tachas', tachas);
app.use('/api/logs', logs);

app.use('/js',express.static(rootPath + 'js/'));
app.use('/templates',express.static(rootPath + 'templates/'));
app.use('/components',express.static(rootPath + 'components/'));
app.use('/fonts',express.static(rootPath + 'fonts/'));

app.use(express.static(rootPath))
app.use(fallback('index.html', { root: rootPath }))

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  // development error handler
// will print stacktrace
// if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
      // console.log(err)
      res
      .status(err.status || 500)
      .json({
        message: err.message,
        error: err
      });
    });
  // } else{
  //   // production error handler
  // // no stacktraces leaked to user
  // app.use(function(err, req, res, next) {
  //   if (err.name === 'UnauthorizedError') {
  //   res.status(401).send('invalid token...');
  // }
  //   res
  //   .status(err.status || 500)
  //   .json({
  //     message: err.message,
  //     error: err
  //   });
  // });
  // }
  
  
  
  
  module.exports = app;