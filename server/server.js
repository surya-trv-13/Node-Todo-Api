require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

const {mongoose} = require('./db/mongoose'); //For connection purpose
const {Users} = require('./model/user');
const {Todo} = require('./model/todo');
const {authenticate} =require('./middleware/authenticate');

var app = express();
var port = process.env.PORT;
// -------------------------------------------------------------------------------
//Use to parse the middleware request into object
app.use(bodyParser.json());
// -------------------------------------------------------------------------------
//This is sending post request from the application
app.post('/todos',authenticate,(req,res) => {
  //creating task from request body
  var task = new Todo({
    text : req.body.text,
    owner : req.user._id
  });
  //Saving the task
  task.save().then((doc) => {
    res.send(doc);
  }).catch((err) => {
    res.status(400).send(err);
  }); //end of save
}); //end of post route
// -------------------------------------------------------------------------------
//Listing all the data from the database...using get function
app.get('/todos',authenticate,(req,res) => {
  Todo.find({owener : req.user._id}).then((result) => {
    //console.log(result);
    res.send({result});
  }).catch((e) => {res.status(400).send(e)})
});//end of get route

//--------------------------------------------------------------------------------
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
// -------------------------------------------------------------------------------
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
// -------------------------------------------------------------------------------
// Update the document using mongoose
// Little comlicated can watch video
app.patch('/todos/:id',(req,res) => {
  var id = req.params.id;
  var body = _.pick(req.body,['status','text']); // This is a lodash method used to pick parameters which required
                                                  // in the object while updating and make it a separate object
  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }

  if(_.isBoolean(body.status) && body.status){  // This checks if the ststus enterd by the user is boolean and the value is true
    body.statusAt = new Date().getTime()       // This is added by the programmer as we do not want to update it
                                                // by the user
  }else{
    body.status = false,                        // else it is left as default values
    body.statusAt = null                        // with no change
  }

  // This is update method for mongoose ... it is similar to the update method of MongoDB
  // It takes a $set to set the value, it takes 'new' key which works same as 'returnOrginal'
  // returnOrginal return the older version whereas new return the updated version of document
  Todo.findByIdAndUpdate(id,{$set : body},{new : true}).then((result) => {
    if(result === null){
      return res.status(404).send();
    }
    res.send({result});
  }).catch((e) => {
    res.status(400).send(e);
  });
});
// -------------------------------------------------------------------------------
//This is the post method to add User to database
app.post('/users',(req,res) => {
  var body = _.pick(req.body,['email','password']);
  var user = new Users(body);

  user.save().then(() => {
    return user.getAuthToken();   // This call the getAuthToken() method defined in  user.js | it returns the save method defined to then callback...
  }).then((token) => {
    res.header('x-auth', token).send(user); // Here the token in the attribute saves the content in the array to the database and get the value for the token
  }).catch((e) => {                         // Header takes two arguments in form of key value pair | first take the key which starts with 'x-' which indicate custom header another is the key
    res.status(400).send(e);
  })

});
// --------------------------------------------------------------------------------

//This route is to get the individual route after entering the header in the header section
app.get('/users/me',authenticate,(req,res) => {
  res.send(req.user);
});

// --------------------------------------------------------------------------------

//POST /user/login
app.post('/users/login',(req,res) => {
  var body = _.pick(req.body,['email','password']);

  Users.findByCredential(body.email,body.password).then((user) => {
    return user.getAuthToken().then((token) => {
      res.header('x-auth', token).send(user);
    });
  }).catch((e) => {
    res.status(400).send();
  });
});

// --------------------------------------------------------------------------------
// Log out a user This will delete a token from the database
app.delete('/users/me/token', authenticate , (req,res) => {
  req.user.logOut(req.token).then(() => {
    res.status(200).send();
  },() => {
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
