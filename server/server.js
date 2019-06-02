const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

const {mongoose} = require('./db/mongoose'); //For connection purpose
const {Users} = require('./model/user');
const {Todo} = require('./model/todo');

var app = express();

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

app.get('/todos/:id',(req,res) => {
  var id = req.params.id;
  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }
  Todo.findById(id).then((result) => {
    if(result === null){
      return res.status(404).send();
    }
    res.send({result});
  }).catch((e) =>{
    res.status(400).send();
  })
});

app.listen(1200,() => {
  console.log('Connected to server 1200');
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
