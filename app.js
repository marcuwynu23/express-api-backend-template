/*
 *   Copyright (c) 2023 
 *   All rights reserved.
 */
var createError = require('http-errors');
var express = require('express');
var session = require('express-session')
var path = require('path');
var logger = require('morgan');
var cors = require('cors')
var helmet = require('helmet')
var crypto = require('crypto');

require('dotenv').config()

var app = express();

app.set('x-powered-by', 'Spring Framework');
app.use(helmet())

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true, httpOnly: true, maxAge: 60000 }
}))
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
}))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


app.use((req, res, next) => {
  const originalSend = res.send; // Save a reference to the original send method

  // Override the send method to intercept the response body and generate a hash code
  res.send = function (body) {
    const userAgent = req.headers['user-agent']; // Get the user agent string from the request headers
    let responseStatusCode = res.statusCode; // Get the response status code
    let responseBodyHashCode = null; // Initialize the hash code variable to null

    if (typeof body === 'string') {
      // If the response body is a string, generate a hash code using the crypto module
      responseBodyHashCode = crypto.createHash('md5').update(body).digest('hex');
    }

    // Check if the user agent string is a known crawler or mobile device
    const isCrawler = /bot|crawl|slurp|spider/i.test(userAgent);
    const isMobile = /mobile/i.test(userAgent);

    if (isCrawler || isMobile) {
      // If the user agent string is a known crawler or mobile device, log the request and response details
      console.log(`User agent: ${userAgent}`);
      console.log(`Request URL: ${req.url}`);
      console.log(`Response status code: ${responseStatusCode}`);
      console.log(`Response body hash code: ${responseBodyHashCode}`);
    }

    // Call the original send method with the response body
    originalSend.apply(res, arguments);
  };

  // Call the next middleware or route handler
  next();
});


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
