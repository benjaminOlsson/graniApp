var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var path = require('path');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();
//view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//The routes for non logged users
app.use('/', routes);
app.use('/login', routes);
app.use('/login/check', routes);
app.use('/logot', routes);
app.use('/signup', routes);
app.use('/signup/check', routes);
//The routes after you logged in
app.use('/users', users);
app.use('/users/:id', users);
app.use('/users/:id/group/:group', users);
app.use('/users/:id/addGroup', users);
app.use('/users/:id/addGroupValidate', users);
app.use('/users/:id/calendar', users);
app.use('/users/:id/calendar/add', users);
app.use('/users/:id/addToCalCheck', users);
app.use('/users/:id/addTeam', users);

app.listen(3000);
