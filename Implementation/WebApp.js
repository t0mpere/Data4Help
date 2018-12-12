var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
const uuid = require('uuid/v4');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const BusinessCustomer = require('./model/BusinessCustomer');

/*
* Routes declarations
 */
var indexRouter = require('./routes/index');
let loginRouter = require('./routes/login');
let logoutRouter = require('./routes/logout');
let registrationRouter = require('./routes/registration');

var webApp = express();

// view engine setup
webApp.set('views', path.join(__dirname, 'views'));
webApp.set('view engine', 'pug');

webApp.use(logger('dev'));
webApp.use(express.json());
webApp.use(express.urlencoded({ extended: false }));
webApp.use(cookieParser());

/*
*Static files setup
 */
webApp.use(express.static(path.join(__dirname, 'public')));
webApp.use('/bootstrap',express.static(__dirname + '/node_modules/bootstrap/'));

/*
*Login using passport.js
* Setup session
 */
webApp.use(session({
    genid: (req) => {
        console.log('Inside the session middleware');
        console.log(req.sessionID);
        return uuid() // use UUIDs for session IDs
    },
    secret: 'oxygenius',
    resave: false,
    saveUninitialized: true
}));
webApp.use(passport.initialize());
webApp.use(passport.session());


/*
*Login strategy
 */
passport.use(new LocalStrategy(
    { usernameField: 'email' },
    (email, password, done) => {
        //retrieve BC from db for user check
        BusinessCustomer.getBusinessCustomerFromDb(email,(bc)=> {
            if(bc._password === password && bc._active) done(null,bc);
            else done(null,false);
        });
    }
));
/*
* User serialization / deserialization middleware
 */
passport.serializeUser((user, done) => {
    console.log(user);
    done(null, user);
});

passport.deserializeUser((user, done) => {
    console.log('Inside deserializeUser callback');
    console.log(`The user id passport saved in the session file store is: ${user}`);
    //const user = users[0].id === id ? users[0] : false;
    done(null, user);
});

/*
* routing requests
 */
webApp.use('/', indexRouter);
webApp.use('/login', loginRouter);
webApp.use('/logout',logoutRouter);
webApp.use('/registration',registrationRouter);


// catch 404 and forward to error handler
webApp.use(function(req, res, next) {
  next(createError(404));
});

// error handler default case
webApp.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = webApp;
