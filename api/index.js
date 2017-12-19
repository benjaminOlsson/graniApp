var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var url = 'mongodb://localhost:27017/myApp';


// Empty serch
module.exports.noId = function(req, res){
  res.send("Nada found");
};
// Get api for a user id
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
module.exports.getUsersGroups = function(req, res){
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
            ++count;
            groups.push(result1[0]);
          });
        });
        db.close();
        var checkGroups = setInterval(function(){
          if((count > 0) && groups.length === count){
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
