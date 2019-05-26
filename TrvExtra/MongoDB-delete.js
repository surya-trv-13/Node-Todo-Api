const {MongoClient,ObjectID} = require('mongodb');

const assert = require('assert');

MongoClient.connect('mongodb://127.0.0.1:27017',{ useNewUrlParser : true },(error,client) =>{
  assert.equal(null,error);

  var db = client.db('Todo-App');

  //DeleteOne
  db.collection('Users').deleteOne({name : 'Suman Mondal'}).then((results) => {
      console.log(results);
  });

  //DeleteMany
  db.collection('Users').deleteMany({name : 'Suman Mondal'}).then((results) => {
    console.log(results);
  });

  //FindOneAndDelete
  db.collection('Users').findOneAndDelete({
    _id : new ObjectID('5cea83d2b07dc91630c68c69')
  }).then((results) => {
    console.log(results);
  });


  client.close();
});




//IMPORTANT
// The schema of the config database is internal and may change between releases of MongoDB.
// The "config" database is not a dependable API, and users should not write data to the config
// database in the course of normal operation or maintenance.
