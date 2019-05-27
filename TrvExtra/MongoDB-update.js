const {MongoClient,ObjectID} = require('mongodb');

const assert = require('assert');

MongoClient.connect('mongodb://127.0.0.1:27017',{ useNewUrlParser : true },(error,client) =>{
  assert.equal(null,error);

  var db = client.db('Todo-App');

  //findOneAndUpdate(filter, update, options, callback)
  //callback takes 2 arguments error and result
  //--------------------------------------
  //This is to update by incrementing any value using $inc
  db.collection('Users').findOneAndUpdate({
    name : 'Shreya Mishra'
  },{
    $inc : {
      age : -7
    }
  },{
    returnOriginal : false
  },(error,results) => {
    if(error){
      console.log(error);
    }
    console.log('Updated Result is ',results);
  });

  //This is to update by changing any value using $set
  db.collection('Todos').findOneAndUpdate({
    _id : new ObjectID('5cea80d116e7730428d4778d')
  },{
    $set :{
      status : true
    }
  },{
    returnOriginal : false
  }).then((result) => {
    console.log('Result is ',result);
  }).catch((error)=>{
    console.log('Error Detected!!');
  })

  //client.close();
});


//For Reference check :
//http://mongodb.github.io/node-mongodb-native/3.2/api/Collection.html#findOneAndUpdate
//https://docs.mongodb.com/manual/reference/operator/update/






//IMPORTANT
// The schema of the config database is internal and may change between releases of MongoDB.
// The "config" database is not a dependable API, and users should not write data to the config
// database in the course of normal operation or maintenance.
