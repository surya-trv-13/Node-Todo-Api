const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/model/todo');
const {Users} = require('./../server/model/user');

var id_todo = '5cf3aa54d0ce282b4cafce40';
var id_user = '5cec3bc2c2990546c494358f1121';

if(!ObjectID.isValid(id_user)){
  console.log('Invalid User ID');
}
if(!ObjectID.isValid(id_todo)){
  console.log('Invalid Todo ID');
}

Todo.find({
  _id : id_todo
}).then((res) => {
  console.log('Todo Array : ',res);
});

Todo.findOne({
  _id : id_todo
}).then((res) => {
  console.log('Todo object : ',JSON.stringify(res,undefined,2));
});


Todo.findById(id_todo).then((r) => {
  if(r === null){
    return console.log('Unable to find ID');
  }

  console.log('Todo By ID',r);
}).catch((e) => console.log('invalid ID'));

Users.findById(id_user).then((r) => {
  if(r === null){
    return console.log('Unable to find ID User');
  }

  console.log('User By ID',r);
}).catch((e) =>{
  return console.log('not found')
});



// mongoose.connection.close();
