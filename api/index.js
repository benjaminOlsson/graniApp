var mongodb = require('mongodb');
var moment = require('moment');
var MongoClient = mongodb.MongoClient;
var url = 'mongodb://localhost:27017/myApp';


// Empty serch
module.exports.noId = function(req, res){
  res.send("Nada found");
};
// User api
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
// Add a user

// Delete
module.exports.deleteOneUser = function(req, res){
  var o_id = new mongodb.ObjectId(req.params.id);
  MongoClient.connect(url, function(err, db){
    var collection = db.collection('users');
    collection.find({'_id': o_id}).toArray(function(err, result){
      if(err){
        console.log(err);
      }else{
        if(result[0]['teams'].length > 0){
          if(result[0]['groups'].length > 0){
            console.log('wrong');
            collection = db.collection('groups');
            collection.update({}, {$pull: {'users': o_id, 'moderators': o_id}}, function(err, result1){
              if(err){
                console.log(err);
              }else{
                collection = db.collection('teams');
                collection.update({}, {$pull: {'users': o_id, 'moderators': o_id}}, function(err, result2){
                  if(err){
                    console.log(err);
                  }else{
                    collection = db.collection('users');
                    collection.remove({'_id': o_id}, function(err, result3){
                      if(err){
                        console.log(err);
                      }else{
                        console.log('1');
                        db.close();
                      }
                    });
                  }
                });
              }
            });
          }else{
            console.log('right');
            collection = db.collection('teams');
            collection.update({}, {$pull: {'users': o_id, 'moderators': o_id}}, function(err, result1){
              if(err){
                console.log(err);
              }else{
                collection = db.collection('users');
                collection.remove({'_id': o_id}, function(err, result2){
                  if(err){
                    console.log(err);
                  }else{
                    console.log('2');
                    db.close();
                  }
                });
              }
            });
          }
        }else{
          console.log('wrong again');
          collection.remove({'_id': o_id}, function(err, result1){
            if(err){
              console.log(err);
            }else{
              db.close();
              console.log('3');
            }
          });
        }
      }
    });
  });
};
// Group api
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
    group.team = team;
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
// Remove a group
module.exports.deleteOneGroup = function(req, res){
  var o_id = new mongodb.ObjectId(req.params.id);
  var g_id = new mongodb.ObjectId(req.params.group);
  MongoClient.connect(url, function(err, db){
    if(err){
      console.log(err);
    }else{
      var collection = db.collection('groups');
      collection.find({"_id": g_id}).toArray(function(err, result){
        if(err){
          console.log(err);
        }else{
          var t_id = new mongodb.ObjectId(result[0].team);
          collection = db.collection('teams');
          collection.update({"_id": t_id}, {$pull: {"groups": {"id": g_id}}}, function(err, result1){
            if(err){
              console.log(err);
            }else{
              collection = db.collection('users');
              collection.update({}, {$pull: {"groups": {"id": g_id}}}, function(err, result2){
                if(err){
                  console.log(err);
                }else{
                  collection = db.collection('groups');
                  collection.remove({"_id": g_id}, function(err, result3){
                    if(err){
                      console.log(err);
                    }else{
                      db.close();
                    }
                  });
                }
              });
            }
          });
        }
      });
    }
  });
};
// Team api
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
// Delete team
module.exports.deleteOneTeam = function(req, res){
  var o_id = new mongodb.ObjectId(req.params.id);
  var t_id = new mongodb.ObjectId(req.params.team);
  MongoClient.connect(url, function(err, db){
    if(err){
      console.log(err);
    }else{
      var collection = db.collection('teams');
      collection.find({'_id': t_id}).toArray(function(err, result){
        if(err){
          console.log(err);
        }else{
          if(result[0]['groups'].length > 0){
            var groups = result[0].groups;
              collection = db.collection('users');
              collection.update({}, {$pull: {'teams': {'id': t_id}}}, function(err, result3){
                if(err){
                  console.log(err);
                }else{
                  collection = db.collection('groups');
                  groups.forEach(function(groupId){
                    var g_id = groupId.id;
                    collection.remove({'_id': g_id}, function(err, result6){
                      if(err){
                        console.log(err);
                      }else{
                        collection = db.collection('users');
                        collection.update({}, {$pull: {'groups': {'id': g_id}}}, function(err, result7){
                          if(err){
                            console.log(err);
                          }else{
                            collection = db.collection('teams');
                            collection.remove({'_id': t_id}, function(err, result7){
                              if(err){
                                console.log(err);
                              }else{
                                db.close();
                              }
                            });
                        }
                      });
                    }
                  });
                });
              }
            });
          }else{
            collection = db.collection('users');
            collection.update({}, {$pull: {'teams': {'id': t_id}}}, function(err, result8){
              if(err){
                console.log(err);
              }else{
                collection = db.collection('teams');
                collection.remove({'_id': t_id}, function(err, result9){
                  if(err){
                    console.log(err);
                  }else{
                    db.close();
                  }
                });
              }
            });
          }
        }
      });
    }
  });
};
module.exports.calendarDay = function(req, res){
  var theDay = req.params.day;
  var theMonth = req.params.month;
  var theYear = req.params.year;

  function aDay(year, month, date){
    this.year = year;
    this.month = month;
    this.date = date;
    this.today = (moment(year +'-'+ month +'-'+ date, 'YYYY-MM-DD').diff(moment().format('YYYY-MM-DD'))) === 0 ? true : false;
    this.day = moment(year + '-' + month + '-' + date, 'YYYY-MM-DD').format('d');
    this.dayName = moment(year + '-' + month + '-' + date, 'YYYY-MM-DD').format('dddd');
    this.dayOfYear = moment(year +'-'+ month +'-'+ date, 'YYYY-MM-DD').dayOfYear();
    this.valid = moment(year + '-' + month + '-' + date, 'YYYY-MM-DD').isValid();
  };
  var day = new aDay(theYear, theMonth, theDay);
  res.send(day);
};
module.exports.calendarMonth = function(req, res){
  var theMonth = req.params.month;
  var theYear = req.params.year;
  //A date object
  function aDay(year, month, date){
    this.year = year;
    this.month = month;
    this.date = date;
    this.today = (moment(year +'-'+ month +'-'+ date, 'YYYY-MM-DD').diff(moment().format('YYYY-MM-DD'))) === 0 ? true : false;
    this.day = moment(year + '-' + month + '-' + date, 'YYYY-MM-DD').format('d');
    this.dayName = moment(year + '-' + month + '-' + date, 'YYYY-MM-DD').format('dddd');
    this.dayOfYear = moment(year +'-'+ month +'-'+ date, 'YYYY-MM-DD').dayOfYear();
    this.valid = moment(year + '-' + month + '-' + date, 'YYYY-MM-DD').isValid();
  };
  // A month object
  function aMonth(year, month){
    this.month = month;
    this.year = year;
    this.monthName = moment(year +'-'+ month, 'YYYY-MM').format('MMMM');
    this.daysInMonth = moment(this.year +'-'+ this.month, 'YYYY-MM').daysInMonth();
    this.valid = moment(year +'-'+ month, 'YYYY-MM').isValid();
  };
  aMonth.prototype.days = function(){
    var result = [];
    for(let i = 1; i <= this.daysInMonth; i++){
      var day = new aDay(this.year, this.month, i);
      result.push(day);
    }
    return result;
  }
  //Calling the calendar object
  var month = new aMonth(theYear, theMonth);
  res.send(month.days());
};
module.exports.calendarYear = function(req, res){
  var theYear = req.params.year;
  // A month object
  function aMonth(year, month){
    this.month = month;
    this.year = year;
    this.thisMonth = (moment(year +'-'+ month, 'YYYY-MM').diff(moment().format('YYYY-MM'))) === 0 ? true : false;
    this.monthName = moment(year +'-'+ month, 'YYYY-MM').format('MMMM');
    this.daysInMonth = moment(this.year +'-'+ this.month, 'YYYY-MM').daysInMonth();
    this.valid = moment(year +'-'+ month, 'YYYY-MM').isValid();
  };
  aMonth.prototype.days = function(){
    var result = [];
    for(let i = 1; i <= this.daysInMonth; i++){
      var day = new aDay(this.year, this.month, i);
      result.push(day);
    }
    return result;
  }
  // A year object
  function aYear(year){
    this.year = year;
    this.valid = moment(year, 'YYYY').isValid();
  };
  aYear.prototype.months = function(){
    var result = [];
    for(let i = 1; i <= 12; i++){
      var month = new aMonth(this.year, i);
        result.push(month);
    }
    return result;
  };
  var year = new aYear(theYear);
  res.send(year.months());
};
