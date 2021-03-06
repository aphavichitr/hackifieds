// node dependencies
var express = require('express');
var session = require('express-session');
var passport = require('passport');
var morgan = require('morgan');
var bodyParser = require('body-parser');

// custom dependencies
var db = require('../db/db');
var listingsCtrl = require('./controllers/listings-controller.js');

var app = express();

var listings = [
  {
    createdAt: '26 Jan 2016',
    title: 'House to let in apartment not centrally located',
    description: 'I like cheese',
    location: 'Pacific Heights',
    price: '$2,500pm'
  },
  {
    createdAt: '30 May 2016',
    title: 'Crappy room in Russian Hill',
    description: 'It\'s the worst.',
    location: 'Russian Hill',
    price: '$1,400'
  }
];
var counter = 0;

//------------------------------------------
// // use middleware
// app.use(session({
//   secret: 'hackyhackifiers',
//   resave: false,
//   saveUninitialized: true
// }));
// app.use(passport.initialize());
// app.use(passport.session());
// configure passport
// passport.use(new LocalStrategy(User.authenticate()));
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

// parse application/json
app.use(bodyParser.json());
// Logging and parsing
app.use(morgan('dev'));

// Set up and use our routes
// app.use('/', router);
// var router = require('./routes.js');
// Serve the client files
// app.use (express.static(__dirname + '/../client'));
app.use (express.static('./client'));

//------------------------------------------

// Routing - chain GET/POST requests for specified route
app.route('/api/listings')
  .get(function(req, res) {
    listingsCtrl.getAll(function(statusCode, results) {
      res.status(statusCode).send(results);
    });
  })
  .post(function(req, res) {
    listingsCtrl.addOne(req.body, function(statusCode, results) {
      res.status(statusCode).send(results);
    });
  });


// Set what we are listening on.
app.listen(3000);

module.exports.app = app;

