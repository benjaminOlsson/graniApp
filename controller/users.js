var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var url = 'mongodb://localhost:27017/myApp'

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
//The 404 page for goint to users without an valid id
module.exports.usersOnly = function(req, res){
  res.send(404, "page not found");
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
        groupInfo.name = result[0].name;
        groupInfo.mod = result[0].moderator;
        groupInfo.created = result[0].created;
      }
      });
      var inter = setInterval(function(){
        if(groupInfo.name !== 'undefined' && groupInfo.mod !== 'undefined'){
          res.render('signed/group', {
            title: groupInfo.name,
            moderator: groupInfo.mod,
            created: groupInfo.created,
            id: id
          });
          db.close();
          clearInterval(inter);
        }
      }, 100);
    }
  });
  };
//The page for adding groupes
module.exports.addGroup = function(req, res){
  var team = [];
  var o_id;
  MongoClient.connect(url, function(err, db){
    if(err){
      console.log(err);
    }else{
    var collection = db.collection('users');
    o_id = new mongodb.ObjectID(req.params.id);
    collection = db.collection('teams');
    collection.find({"users": [o_id]}).toArray(function(err, result){
      if(err){
        console.log(err);
      }else{
        if(result.length > 0){
          for(let i = 0; i < result.length; i++){
            var t_id = new mongodb.ObjectId(result[i]._id);
            team[i] = {name: result[i].name, id: t_id};
            res.render('signed/addGroup', {
              title: "Add Group",
              id: o_id,
              team: team
            });
          }
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
//The page that validates a new added groupe
module.exports.addGroupValidate = function(req, res){
  var groupId = 0;
  var o_id = new mongodb.ObjectId(req.params.id);
  MongoClient.connect(url, function(err, db){
    if(err){
      console.log(err);
    }else{
      var group1 = {
        name: req.body.name,
        moderator: req.body.moderator,
        created: new Date()
      };
      var collection = db.collection('groups');
      collection.insert(group1, function(err, result){
        if(err){
          console.log("error at 1");
        }
      });
      collection.find({"name": group1.name}).toArray(function(err, result){
        if(err){
          console.log("error at 2");
        }else if(result.length > 0){
          groupId = new mongodb.ObjectId(result[0]._id);
          groupName = result[0].name;
        }
      });
      var t_id = new mongodb.ObjectId(req.body.team);
      collection = db.collection('teams');
      var testgId = setInterval(function(){
        if((groupId !== 0) || (groupId !== "0") || (groupId !== 'null') || (groupId !== null) || (groupId !== undefined)){
          var pushGroup = {"name": groupName, "id": groupId};
              collection.update({"_id": t_id}, {$push: {"groups": groupId}}, function(err, result){
                if(err){
                  console.log(err);
                  clearInterval(testgId);
                }else{
                  collection = db.collection('users');
                  collection.update({"_id": o_id}, {"$push": {"groups": pushGroup}}, function(err, result){
                    if(err){
                      console.log("2");
                      clearInterval(testgId);
                    }else{
                      console.log("pushed groupId to user");
                      res.redirect('/users/' + o_id);
                      clearInterval(testgId);
                    }
                });
                }
              });
        }
      }, 200);
    }
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
//Add a team page
module.exports.addTeam = function(req, res){
  var id = req.params.id;
  res.render('signed/addTeam', {
    id: id
  });
}
//Add the team to the teams database
module.exports.addTeamValidate = function(req, res){
  var o_id = new mongodb.ObjectId(req.params.id);
  var storeId = 0;
  MongoClient.connect(url, function(err, db){
    if(err){
      console.log(err);
    }else{
      var collection = db.collection('teams');
      var team = {
        name: req.body.teamName,
        sport: req.body.sport,
        users: [o_id],
        groups: [],
        created: new Date()
      };
      collection.insert([team], function(err, result){
        if(err){
          console.log(err);
        }else{
          storeId = {id: result.ops[0]._id, name: result.ops[0].name};
          var storeTeamId = setInterval(function(){
            if((storeId.id !== 0) || (storeId.id !== "0") || (storeId.id !== null) || (storeId.id !== 'null') || (storeId.id !== undefined) || (storeId.id !== "undefined")){
              console.log(storeId);
              clearInterval(storeTeamId);
              collection = db.collection('users');
              collection.update({"_id": o_id}, {$push: {"teams": storeId}}, function(err, result){
                  if(err){
                    console.log("error to userDB");
                    clearInterval(storeTeamId);
                  }else{
                    db.close();
                    res.redirect('/users/' + o_id);
                    clearInterval(storeTeamId);
                  }
              });
            }
          }, 200);
        }
        });
      }
    });
  };
