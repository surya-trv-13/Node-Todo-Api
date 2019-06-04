const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/model/todo');
const {Users} = require('./../server/model/user');

//Temporary IDs which extracted from the MONGO DB xD
var id_todo = '5cf3aa54d0ce282b4cafce40';
var id_user = '5cec3bc2c2990546c494358f';

//This is to remove document at a bulk and which match the Query
// with no query we can delete all the documents in the collection
Todo.remove({}).then((res) => {
  console.log(res);
});

//This is to remove a document from the collection by finding one
// document which match the query
Todo.findOneAndRemove({text : 'Something to do'}).then((result) => {
  console.log(result);
});

//This is to remove a document from the collection by ID
Users.findByIdAndRemove(id_user).then((res) => {
  console.log(res);
});
