var env = process.env.NODE_ENV || 'development' ;

if(env === 'development'){
  process.env.PORT = 1200;
  process.env.MONGODB_URI = 'mongodb://127.0.0.1:27017/TodoApp';
}else if(env === 'test'){
  process.env.PORT = 1200;
  process.env.MONGODB_URI = 'mongodb://127.0.0.1:27017/TodoAppTest';
}


const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

const {mongoose} = require('./db/mongoose'); //For connection purpose
const {Users} = require('./model/user');
const {Todo} = require('./model/todo');

var app = express();
var port = process.env.PORT;

//Use to parse the middleware request into object
app.use(bodyParser.json());

//This is sending post request from the application
app.post('/todos',(req,res) => {
  //creating task from request body
  var task = new Todo({
    text : req.body.text,
    // statusAt : req.body.statusAt,
    status : req.body.status
  });
  //Saving the task
  task.save().then((doc) => {
    res.send(doc);
  }).catch((err) => {
    res.status(400).send(err);
  }); //end of save
}); //end of post route

//Listing all the data from the database...using get function
app.get('/todos',(req,res) => {
  Todo.find().then((result) => {
    //console.log(result);
    res.send({result});
  }).catch((e) => {res.status(400).send(e)})
});//end of get route

//This is to get back the response for the specific data whose ID is passed in the URL.
app.get('/todos/:id',(req,res) => {
  var id = req.params.id;   // req params reas all the parameter passed to the URL as :id

  if(!ObjectID.isValid(id)){    //This will check the id is a valid id for mongoDB or not
    return res.status(404).send();
  }

  Todo.findById(id).then((result) => {    //This is finding One document whose ID matche as the parameter passed ,
    if(result === null){                  // return null for faliure
      return res.status(404).send();
    }
    res.send({result});
  }).catch((e) =>{
    res.status(400).send();
  })
});

app.delete('/todos/:id',(req,res) => {
  var id = req.params.id;

  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }
  // Delete the document using mongoose for more can check
  // TrvExtra/mongoose-remove.js
  Todo.findByIdAndRemove(id).then((results) => {
    if(!results){
      return res.status(404).send();
    }
    res.send({results});
  }).catch((e) => {
    res.status(400).send();
  })
});

// Update the document using mongoose
// Little comlicated can watch video
app.patch('/todos/:id',(req,res) => {
  var id = req.params.id;
  var body = _.pick(req.body,['status','text']); // This is a lodash method used to pick objects whic required
                                                  // in the object while updating
  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }

  if(_.isBoolean(body.status) && body.status){  // This checks if the ststus enterd by the user is boolean and the value is true
    body.statusAt : new Date().getTime()       // This is added by the programmer as we do not want to update it
                                                // by the user
  }else{
    body.status : false,                        // else it is left as default values
    body.statusAt : null                        // with no change
  }

  // This is update method for mongoose ... it is similar to the update method of MongoDB
  // It takes a $set to set the value, it takes 'new' key which works same as 'returnOrginal'
  // returnOrginal return the older version whereas new return the updated version of document
  Todo.findByIdUpdate(id,{$set : body},{new : true}).then((result) => {
    if(result === null){
      return res.status(404).send();
    }
    res.send({res});
  }).catch((e) => {
    res.status(400).send();
  });
});

app.listen(port,() => {
  console.log(`Connected to port ${port}`);
});

module.exports = {app};

//Query...
//How mongoose select collection name and how to change it..
//https://mongoosejs.com/docs/guide.html#collection
//-----------------------------------------------------------------------------
//Mongoose Validation
//https://mongoosejs.com/docs/validation.html
//-----------------------------------------------------------------------------
//Mongoose Schema
//https://mongoosejs.com/docs/guide.html
