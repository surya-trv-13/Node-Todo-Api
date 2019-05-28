const express = require('express');
const bodyParser = require('body-parser');

const {mongoose} = require('./db/mongoose');
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
    // status : req.body.status
  });

  //Saving the task
  task.save().then((doc) => {
    res.send(doc);
  }).catch((err) => {
    res.status(400).send(err);
  }); //end of save
}); //end of post route


app.listen(1200,() => {
  console.log('Connected to server 1200');
});


//Query...
//How mongoose select collection name and how to change it..
//https://mongoosejs.com/docs/guide.html#collection
//-----------------------------------------------------------------------------
//Mongoose Validation
//https://mongoosejs.com/docs/validation.html
//-----------------------------------------------------------------------------
//Mongoose Schema
//https://mongoosejs.com/docs/guide.html
