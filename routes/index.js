var express = require('express');
var controll = require('../controller/index');
var router = express.Router();

//Front page
router.get('/', controll.frontPage);
//login page
router.get('/login', controll.loginPage);
//posting the login information
router.post('/login/check', controll.loginCheck);
//loging out
router.get('/logout', controll.logout);
//Signup page
router.get('/signup', controll.signupPage);
//Validating signupPage
router.post('/signup/check', controll.signupCheck);

module.exports = router;
