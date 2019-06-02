const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/model/todo');
const {Users} = require('./../server/model/user');

//Temporary IDs which extracted from the MONGO DB xD
var id_todo = '5cf3aa54d0ce282b4cafce40';
var id_user = '5cec3bc2c2990546c494358f1121';

 // This will check the id is a valid id for mongoDB or not
if(!ObjectID.isValid(id_user)){
  console.log('Invalid User ID');
}
if(!ObjectID.isValid(id_todo)){
  console.log('Invalid Todo ID');
}

//This wil find the documents which matches the query passed in as parameter
Todo.find({
  _id : id_todo
}).then((res) => {
  console.log('Todo Array : ',res);
});

//This wil find only one document which matches the query passed in as parameter
Todo.findOne({
  _id : id_todo
}).then((res) => {
  console.log('Todo object : ',JSON.stringify(res,undefined,2));
});

//This wil find the document which matches the ID passed in as parameter
Todo.findById(id_todo).then((r) => {
  if(r === null){   // This is to check whether the id has document or not
    return console.log('Unable to find ID');
  }

  console.log('Todo By ID',r);
}).catch((e) => console.log('invalid ID'));

// This is same as above for the user 
Users.findById(id_user).then((r) => {
  if(r === null){
    return console.log('Unable to find ID User');
  }

  console.log('User By ID',r);
}).catch((e) =>{
  return console.log('not found')
});



// mongoose.connection.close();
