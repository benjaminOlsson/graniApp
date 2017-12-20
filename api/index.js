var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var url = 'mongodb://localhost:27017/myApp';


// Empty serch
module.exports.noId = function(req, res){
  res.send("Nada found");
};
// Api for a user id
// Get
module.exports.getOneUser = function(req, res){
  var o_id = new mongodb.ObjectId(req.params.id);
  MongoClient.connect(url, function(err, db){
    var collection = db.collection('users');
    collection.find({"_id": o_id}).toArray(function(err, result){
      if(err){
        res.send({ err: "did not find user" });
      }else{
        db.close();
        res.send(result[0]);
      }
    });
  });
};
// Get api for users groups
module.exports.getUsersGroup = function(req, res){
  var o_id = new mongodb.ObjectId(req.params.id);
  var groups = [];
  var count = 0;
  MongoClient.connect(url, function(err, db){
    var collection = db.collection('users');
    collection.find({"_id": o_id}).toArray(function(err, result){
      if(err){
        res.send({err: "Error"});
      }else{
        collection = db.collection('groups');
        result[0]['groups'].forEach(function(group){
          var g_id = new mongodb.ObjectId(group.id);
          collection.find({"_id": g_id}).toArray(function(err, result1){
            groups.push(result1[0]);
          });
        });
        db.close();
        var checkGroups = setInterval(function(){
          if(groups.length === result[0]['groups'].length){
            clearInterval(checkGroups);
            res.send(groups);
          }else if(count === 0){
            clearInterval(checkGroups);
            res.send(groups);
          }
        }, 200);
        }
    });
  });
};
// Add a group
module.exports.postOneGroup = function(req, res){
  var o_id = new mongodb.ObjectId(req.params.id);
  MongoClient.connect(url, function(err, db){
    var group = {};
    var team = new mongodb.ObjectId(req.body.team);
    var collection = db.collection('groups');
    group.name = req.body.name;
    group.description = req.body.description;
    group.moderators = [o_id];
    group.users = [o_id];
    group.created = new Date();
    collection.insert(group, function(err, result){
      if(err){
        console.log(err);
      }else{
        collection = db.collection('users');
        collection.update({"_id": o_id}, {$push: {"groups": {"id": new mongodb.ObjectID(result.ops[0]._id), "name": result.ops[0].name}}}, function(err, result1){
          if(err){
            console.log(err);
          }else{
            collection = db.collection('teams');
            collection.update({"_id": team}, {$push: {"groups": {"id": new mongodb.ObjectID(result.ops[0]._id), "name": result.ops[0].name}}}, function(err, result2){
              if(err){
                console.log(err);
              }else{
                db.close();
                res.redirect('/users/' + o_id);
              }
            });
          }
        });
      }
    });
  });
};
// Get api for users teams
module.exports.getUserTeam = function(req, res){
  var o_id = new mongodb.ObjectId(req.params.id);
  var teams = [];
  MongoClient.connect(url, function(err, db){
    if(err){
      console.log(err);
    }else{
      var collection = db.collection('users');
      collection.find({"_id": o_id}).toArray(function(err, result){
        if(err){
          console.log(err);
        }else{
          collection = db.collection('teams');
          result[0]['teams'].forEach(function(team){
            var t_id = new mongodb.ObjectId(team.id);
            collection.find({"_id": t_id}).toArray(function(err, result1){
              if(err){
                console.log(err);
              }else{
                teams.push(result1[0]);
              }
            });
          });
          db.close();
          var checkTeams = setInterval(function(){
            if(teams.length === result[0]['teams'].length){
              res.send(teams);
              clearInterval(checkTeams);
            }
          }, 200);
        }
      });
    }
  });
};
// Post
module.exports.postOneTeam = function(req, res){
  var o_id = new mongodb.ObjectId(req.params.id);
  // Add a team
  var team = {};
  var teamId = 0;
  team.name = req.body.teamName;
  team.sport = req.body.sport;
  team.description = req.body.description;
  team.moderators = [o_id];
  team.users = [o_id];
  team.groups = [];
  team.created = new Date();

  MongoClient.connect(url, function(err, db){
    var collection = db.collection('teams');
    collection.insert(team, function(err, result){
      if(err){
        console.log(err);
      }else{
        collection = db.collection('users');
        collection.update({"_id": o_id}, {$push: {"teams": {"id": new mongodb.ObjectId(result.ops[0]._id), "name": result.ops[0].name}}}, function(err, result1){
          if(err){
            console.log(err);
          }else{
            db.close();
            res.redirect('/users/' + o_id);
          }
        });
      }
    });
  });
};
