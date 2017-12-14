var auth = require('./check/index');
var mongodb = require('mongodb');
var cookieParser = require('cookie-parser');

var MongoClient = mongodb.MongoClient;
var url = 'mongodb://localhost:27017/myApp';

//frontpage
module.exports.frontPage = function(req, res){
  if(!req.cookies.user){
    res.render('front/index', {
      title: "Freelancing"
    });
  }else{
    MongoClient.connect(url, function(err, db){
      if(err){
        console.log(err);
      }else{
      var collection = db.collection('users');
      collection.find({'username': req.cookies.user}).toArray(function(err, result){
          res.redirect('/users/' + result[0]._id);
      });
    }
    });
  }
};
//login page
module.exports.loginPage = function(req, res){
  res.render('front/login', {
    title: "Login"
  });
};
//login check
module.exports.loginCheck = function(req, res){
  var username = req.body.username;
  var password = req.body.password;
  MongoClient.connect(url, function(err, db){
    if(err){
      console.log("error 1");
    }else{
      var collection = db.collection('users');
      collection.find({"username": username}).toArray(function(err, end){
        if(err){
        }else if(end.length === 1){
          if(password === end[0].password){
            let redirr = '/users/' + end[0]._id;
            res.cookie('user', username);
            res.redirect(redirr);
          }else{
            res.redirect('front/login');
          }
        }else{
          res.redirect('/login');
        }
        });
    }
    db.close();
  });
};
//loging out
module.exports.logout = function(req, res){
  res.clearCookie('user');
  res.redirect('/');
}
//signup page
module.exports.signupPage = function(req, res){
  res.render('front/signup', {
    title: "Signup"
  });
};
//Validating signup
module.exports.signupCheck = function(req, res){
      var test = auth.authUser(
      req.body.firstName,
      req.body.lastName,
      req.body.gender,
      req.body.age,
      req.body.address,
      req.body.postCode,
      req.body.city,
      req.body.username,
      req.body.password1,
      req.body.password2,
      req.body.email
    );
    if(test === 1){
        var user1 = {
        firstname: req.body.firstName,
        lastname: req.body.lastName,
        gender: req.body.gender,
        age: req.body.age,
        address: req.body.address,
        postcode: req.body.postCode,
        city: req.body.city,
        username: req.body.username,
        password: req.body.password1,
        email: req.body.email,
        teams: [],
        groups: []
      };
      MongoClient.connect(url, function(err, db){
        if(err){
          console.log(err);
        }else{
          console.log("connected");
          var collection = db.collection('users');
          collection.insert([user1], function(err, result){
            if(err){
              console.log(err);
            }else{
              res.clearCookie('user');
              res.redirect('/');
            }
          });
        }
        db.close();
      });
    }else{
      console.log("did not work");
      res.redirect('/signup');
    }
};
