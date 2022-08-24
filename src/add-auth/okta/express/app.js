var createError = require('http-errors');
var express = require('express');
const session = require('express-session');
const { ExpressOIDC } = require('@okta/oidc-middleware');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

require('dotenv').config()

var app = express();
const oidc = new ExpressOIDC({
  issuer: process.env.OIDC_ISSUER,
  client_id: process.env.OIDC_CLIENT_ID,
  client_secret: process.env.OIDC_CLIENT_SECRET,
  appBaseUrl: process.env.BASE_URL,
  loginRedirectUri: `${process.env.BASE_URL}/callback`,
  scope: 'openid profile',
  routes: {
    loginCallback: {
      path: '/callback'
    },
  }
});
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: false
}));
app.use(oidc.router);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
