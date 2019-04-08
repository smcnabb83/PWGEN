var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

var isDBA = function (element) {
  return element === 'GF\\DBA';
}

app.use(function (req, res, next) {
  var nodeSSPI = require('node-sspi');
  var nodeSSPIObj = new nodeSSPI({
    retrieveGroups: true
  });
  nodeSSPIObj.authenticate(req, res, function (err) {
    if (err) {
      res.error("Authentication failed");
    } else {
      if (req.connection.userGroups.find(isDBA) !== undefined) {
        console.log(req.connection.user);
        next();
      } else {
        res.error("User " + req.connection.user.toString() + "is not authorized to access this application");
      }
    }
  })
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('The page you are looking for does not exist');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
app.listen(8925);
module.exports = app;