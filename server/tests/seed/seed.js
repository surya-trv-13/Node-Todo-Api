const jwt = require('jsonwebtoken');
const{ObjectID} = require('mongodb');

const {Todo} = require('./../../model/todo');
const {Users} = require('./../../model/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
var users =[{
    _id: userOneId,
    email : 'surya@gmail.com',
    password : 'userOnePass',
    tokens : [{
      access : 'auth',
      token : jwt.sign({_id : userOneId,access : 'auth'},process.env.JWT_SECRET)
    }]
},{
  _id : userTwoId,
  email : 'ipsipucchi@gmail.com',
  password : 'userTwoPass',
  tokens : [{
    access : 'auth',
    token : jwt.sign({_id : userTwoId,access : 'auth'},process.env.JWT_SECRET)
  }]
}];

var todos = [{
  _id : new ObjectID(),
  text : 'First todo',
  owner : userOneId
},{
  _id: new ObjectID(),
  text : 'Second Todo',
  status : true,
  statusAt : 123,
  owner : userTwoId
}];

const populateUsers = (done) => {
  Users.deleteMany({}).then(() => {
    var userOne = new Users(users[0]).save();
    var userTwo = new Users(users[1]).save();

    return Promise.all([userOne,userTwo]);    // This will take "array of promises" and it will return...
  }).then(() => done())
  .catch(e => {return done(e)});
};


const populateTodos = (done) => {
  //Todo.remove({}).then(() => done()); --> Deprecated version
  Todo.deleteMany({}).then(() => {
    Todo.insertMany(todos);
  }).then(() => done());
};

module.exports = {populateTodos,todos,populateUsers,users};
/*
* This is just a refactored part of main Server.test file to make it clearer and simpler
* All the functions to create todos and populating it is done here
* only test cases are written in test.js file
*/
