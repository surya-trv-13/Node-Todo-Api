// const MongoClient = require('mongodb').MongoClient;
const {MongoClient,ObjectID} = require('mongodb');  //Object Destructuring ... Read 17th May 2018


const assert = require('assert'); // https://www.w3schools.com/nodejs/met_assert.asp

//Created MongoDB connection
MongoClient.connect('mongodb://127.0.0.1:27017',{ useNewUrlParser : true },(error,client) =>{
  assert.equal(null,error);

  // Specified which Database we should use for storing data in collection xD
  var db = client.db('Todo-App');

  //This is how to fetch Data using find() function
  db.collection('Todos').find({status : true}).toArray().then((docs) => {
    console.log('Todos :');
    console.log(JSON.stringify(docs,undefined,3));
  },(error) => {
    assert.equal(null,error);
  });

  // This is to find the collection through the objectID
  db.collection('Todos').find({
    _id : new ObjectID('5cea8155d24e5d29c8d20482')
  }).toArray().then((docs) => {     //Using ES6 promise xD
    console.log('Todos :');
    console.log(JSON.stringify(docs,undefined,3));
  }).catch((error) => {
    assert.equal(null,error);
  });


  //Count the number of collection
  //find() craete a cursor which has some functions which we are using ....
  db.collection('Todos').find({}).count().then((count) => {
    console.log(`Todos count : ${count}`)
  },(error) => {
    assert.equal(null,error);
  });

  db.collection('Users').find({name : 'Suman Mondal'}).count().then((count) => {
    console.log(`Users count : ${count}`)
  },(error) => {
    assert.equal(null,error);
  });


  client.close();
});




//IMPORTANT
// The schema of the config database is internal and may change between releases of MongoDB.
// The "config" database is not a dependable API, and users should not write data to the config
// database in the course of normal operation or maintenance.
