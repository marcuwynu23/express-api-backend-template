/*
 *   Copyright (c) 2023 
 *   All rights reserved.
 */
var createError = require('http-errors');
var express = require('express');
var session = require('express-session')
var path = require('path');
var logger = require('morgan');


var app = express();

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/auth', require('./routes/auth').router)
app.use('*', require('./routes/auth').authHandler)
app.use('/api', require('./routes/api'))



// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({
    status: err.status,
    message: "Error."
  })
});

module.exports = app;
