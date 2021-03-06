var express = require('express')
var exphbs  = require('express-handlebars');
var path = require('path')
var bodyParser = require('body-parser')
var validator = require('express-validator')

//Initializes express
let app = express();

// YOUR CODE HERE

//creates express validator
app.use(validator());

// Handlabars setup using handlebars and express-handlebars(apparently they are different)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');
app.engine('handlebars', exphbs({defaultLayout: 'main'}));

// Parse req.body contents
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// All of our routes are in routes.js
let routes = require('./routes');
app.use('/', routes);


//Creates the listening port for the application
let port = process.env.PORT || 2345;
app.listen(port);
console.log('Server running at http://localhost:%d/', port);

module.exports = app;
