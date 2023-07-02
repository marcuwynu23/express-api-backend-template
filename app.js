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
  const originalSend = res.send;
  res.send = function (body) {
    const userAgent = req.headers['user-agent'];
    let responseStatusCode = res.statusCode;
    let responseBodyHashCode = null;
    if (typeof body === 'string') {
      responseBodyHashCode = crypto.createHash('md5').update(body).digest('hex');
    }

    const isCrawler = /bot|crawl|slurp|spider/i.test(userAgent);
    const isMobile = /mobile/i.test(userAgent);

    if (isCrawler || isMobile) {
      console.log(`User agent: ${userAgent}`);
      console.log(`Request URL: ${req.url}`);
      console.log(`Response status code: ${responseStatusCode}`);
      console.log(`Response body hash code: ${responseBodyHashCode}`);
    }

    originalSend.apply(res, arguments);
  };

  next();
});


app.use('/api/auth', require('./routes/auth').router)
app.use('*', require('./routes/auth').authHandler)
app.use('/api', require('./routes/api'))



app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
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
