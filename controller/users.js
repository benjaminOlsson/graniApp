var mongodb = require('mongodb');
var moment = require('moment');
var MongoClient = mongodb.MongoClient;
var url = 'mongodb://localhost:27017/myApp';

//The 404 page for goint to users without an valid id
module.exports.usersOnly = function(req, res){
    res.send(404, "page not found");
  };
//The frontpage for the logged user
module.exports.frontPage = function(req, res){
  var user = {};
  if(req.params.id.length < 12){
    res.redirect('/login');
  }else{
      MongoClient.connect(url, function(err, db){
        if(err){
          console.log("error 3");
        }else{
          var collection = db.collection('users');
          var o_id = new mongodb.ObjectID(req.params.id);
          collection.find({"_id": o_id}).toArray(function(err, result){
            if(err){
              console.log("db error");
            }else{
              user.fname = result[0].firstname;
              user.lname = result[0].lastname;
              user.email = result[0].email;
              user.address = result[0].address;
              user.postcode = result[0].postcode;
              user.city = result[0].city;
              user.username = result[0].username;
              user.title = result[0].firstname + " " + result[0].lastname;
              user.group = result[0].groups;
              user.id = o_id;
              user.groupName = [];
              user.teams = result[0].teams;
              }
            });
            var g_id;
            var inter = setInterval(function(){
              if(user.group.length > 0){
                for(let i = 0; i < user.group.length; i++){
                  g_id = user.group[i];
                  collection = db.collection('groups');
                  collection.find({"_id": g_id.id}).toArray(function(err, result){
                    if(err){
                      console.log(err);
                      clearInterval(inter);
                    }else{
                      user.groupName[i] = result[0].name;
                      if(i === (user.group.length - 1)){
                        db.close();
                        res.render('signed/userFront', user);
                        clearInterval(inter);
                      }
                    }
                  });
                }
              }else{
                db.close();
                res.render('signed/userFront', user);
                clearInterval(inter);
              }
            }, 100);
            }
          });
        }
      };
//The standard group page
module.exports.group = function(req, res){
  var groupInfo = {};
  var id = new mongodb.ObjectId(req.params.id);
  var groupId = new mongodb.ObjectId(req.params.group);
  MongoClient.connect(url, function(err, db){
    if(err){
      console.log(err);
    }else{
      var collection = db.collection('groups');
      collection.find({"_id": groupId}).toArray(function(err, result){
        if(err){
          console.log(err);
        }else{
        if(result.length > 0){
          groupInfo.name = result[0].name;
          groupInfo.description = result[0].description;
          groupInfo.created = result[0].created;
          groupInfo.id = groupId;
          groupInfo.team = new mongodb.ObjectId(result[0].team);
        }else{
          res.redirect('/users/' + id);
        }
      }
      });
      var inter = setInterval(function(){
        if(groupInfo.name !== 'undefined' && groupInfo.mod !== 'undefined'){
          res.render('signed/group', {
            id: id,
            groupInfo: groupInfo
          });
          db.close();
          clearInterval(inter);
        }
      }, 200);
    }
  });
  };
//The page for adding groupes
module.exports.addGroup = function(req, res){
  var team = [];
  var o_id = new mongodb.ObjectId(req.params.id);
  MongoClient.connect(url, function(err, db){
    if(err){
      console.log(err);
    }else{
    collection = db.collection('users');
    collection.find({"_id": o_id}).toArray(function(err, result){
      if(err){
        console.log(err);
      }else{
        if(result[0]['teams'].length > 0){
          result[0]['teams'].forEach(function(teams){
            team.push({id: teams.id, name: teams.name});
          });
          res.render('signed/addGroup', {
            title: "Add Group",
            id: o_id,
            team: team
          });
        }else{
          res.render('signed/addGroup', {
            title: "Add Group",
            id: o_id,
            team: team
          });
        }
      }
    });
    }
    });
};
//The page for adding a team
module.exports.addTeam = function(req, res){
  var id = new mongodb.ObjectId(req.params.id);
  res.render('signed/addTeam.jade', {
    id: id
  });
};
//The calendar page
module.exports.calendar = function(req, res){
  res.render('signed/calendar', {
    title: "Calendar",
    id: req.params.id
  });
};
//Adding new appointments to calendar
module.exports.addToCal = function(req, res){
  res.render('signed/addToCal', {
    title: 'Add To Calendar',
    id: req.params.id
  });
};
//Adding the calendar input to mongoDb
module.exports.addToCalCheck = function(req, res){

};
//Page for an overview of the team
module.exports.teams = function(req, res){
  var id = new mongodb.ObjectId(req.params.id);
  var t_id = new mongodb.ObjectId(req.params.teamId);
  var teamInfo = {};
  MongoClient.connect(url, function(err, db){
    if(err){
      console.log("connect err", err);
    }else{
      var collection = db.collection('teams');
      collection.find({"_id": t_id}).toArray(function(err, result){
        if(err){
          console.log("id err", err);
        }else{
          if(result.length > 0){
            res.render('signed/teams.jade', {
              id: id,
              team: result[0].name,
              description: result[0].description,
              sport: result[0].sport,
              teamId: t_id
            });
          }else{
            res.redirect('/users/' + id);
          }
        }
      });
    }
  });
};
//Testing alternative Calendar
