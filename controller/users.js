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
              }
            });
            var g_id;
            var inter = setInterval(function(){
              if(user.group.length > 0){
                for(let i = 0; i < user.group.length; i++){
                  g_id = new mongodb.ObjectId(user.group[i]);
                  collection = db.collection('groups');
                  collection.find({"_id": g_id}).toArray(function(err, result){
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
  MongoClient.connect(url, function(err, db){
    if(err){
      console.log(err);
    }else{
      var groupId = new mongodb.ObjectId(req.params.group);
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
  MongoClient.connect(url, function(err, db){
    if(err){
      console.log(err);
    }else{
    var collection = db.collection('users');
    o_id = new mongodb.ObjectID(req.params.id);
    res.render('signed/addGroup', {
      title: "Add Group",
      id: o_id
    });
  }
  db.close();
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
        created: Date()
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
          groupId = result[0]._id;
          groupName = result[0].name;
        }
      });
      var inter = setInterval(function(){
      if(groupId !== 0 || groupId !== 'null' || groupId !== null){
      collection = db.collection('users');
      collection.update({"_id": o_id}, {"$push": {"groups": groupId}}, function(err, result){
        if(err){
          console.log(err);
          clearInterval(inter);
        }else{
          console.log("group set");
          res.redirect('users/' + o_id);
          clearInterval(inter);
        }
      });
      }
    }, 100);
  }
  db.close();
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
//Add a team to the database
module.exports.addTeam = function(req, res){
  res.render('signed/addTeam');
}
