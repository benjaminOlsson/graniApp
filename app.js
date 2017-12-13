var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

//Static content middleware
app.use(express.static(path.join(__dirname, 'public')));

//Body-parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//Cookie-parser middleware
app.use(cookieParser());

// Setting the view engine
app.set('view engine', 'jade');
app.set('views', path.join(__dirname, 'views'));

// The routes
//Frontpages
app.use('/', routes);
app.use('/login', routes);
app.use('/login/check', routes);
app.use('/logout', routes);
app.use('/signup', routes);
app.use('/signup/check', routes);
//Userpages after login
app.use('/users', users);
app.use('/users/:id', users);
app.use('/users/:id/addGroup', users);
app.use('/users/:id/addGroupValidate', users);
app.use('/users/:id/group/:group', users);
app.use('/users/:id/calendar', users);
app.use('/users/:id/calendar/add', users);
app.use('/users/:id/addToCalCheck', users);
app.use('/users/:id/addTeam', users);
/*
app.use('/users/:id/addGroupe', users);
*/

app.listen(3000, function(){
  console.log('Server listening on port 3000');
});
