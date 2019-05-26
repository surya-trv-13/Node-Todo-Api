const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

MongoClient.connect('mongodb://127.0.0.1:27017',{ useNewUrlParser : true },(error,client) =>{
  assert.equal(null,error);

  var db = client.db('Todo-App');

  // db.collection('Todos').insertOne({
  //   task : 'Something to do with Today',
  //   status : false
  // },(err,results) => {
  //   assert.equal(null,err);
  //   console.log(JSON.stringify(results.ops, undefined ,3));
  // });

  db.collection('Users').insertOne({
    name : 'Suman Mondal',
    age : 19,
    location : 'Asansol'
  },(err,results) => {
    assert.equal(null,err);
    console.log(JSON.stringify(results.ops , undefined, 2));
  });

  client.close();
});




//IMPORTANT
// The schema of the config database is internal and may change between releases of MongoDB.
// The "config" database is not a dependable API, and users should not write data to the config
// database in the course of normal operation or maintenance.
