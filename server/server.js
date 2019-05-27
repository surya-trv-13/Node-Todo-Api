const mongoose = require('mongoose');

//Connection to database using mongoose
//try to figure out the work behind the scene of the connect
mongoose.connect('mongodb://127.0.0.1:27017/TodoApp',{ useNewUrlParser: true });
const Schema = mongoose.Schema;

// //Schema of the Todo collection..
// //It is the mapping of the Todo Collection
// var TodoSchema = new Schema({
//   text : {
//     type : String,
//     required : true,
//     minlength : 5,
//     trim : true
//   },
//   status : {
//     type : Boolean,
//     default : false
//   },
//   statusAt : {
//     type : Number,
//     default : null
//   }
// });
//
// //Created Model of the Todo Schema...
// //To use the schema we use it through passing it to model
// const Todo = mongoose.model('Todo',TodoSchema);
//
// //Creating Todo
// var newTask = new Todo({
//   text : 'Compete the work given',
//   statusAt : 3
// });
//
// //Saving Todo to database
// newTask.save().then((res) => {
//   console.log('Added to the data base!');
// }).catch((e) => {
//   console.log('Unable to save the task');
// });

//Schema for Users collection
var UserSchema = new Schema({
  email : {
    type : String,
    required : true,
    trim : true,
    minlength : 5
  }
});

//Adding it to Model
var Users = mongoose.model('Users',UserSchema);

//Adding a user data
var newUser = new Users({
  email : 'suryanarayan88@outlook.com'
});

//Saving it to mongodb
newUser.save().then((res) => {
  console.log('Added a new User! ',res);
}).catch((e) => {
  console.log('Error found is ',e);
});




//Query...
//mongoose.Promise = global.Promise;
//No longer required
//Check - https://stackoverflow.com/questions/51862570/mongoose-why-we-make-mongoose-promise-global-promise-when-setting-a-mongoo
//-----------------------------------------------------------------------------
//How mongoose select collection name and how to change it..
//https://mongoosejs.com/docs/guide.html#collection
