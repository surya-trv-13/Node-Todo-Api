var mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Schema of the Todo collection..
//It is the mapping of the Todo Collection
var TodoSchema = new Schema({
  text : {
    type : String,
    required : true,
    minlength : 5,
    trim : true
  },
  status : {
    type : Boolean,
    default : false
  },
  statusAt : {
    type : Number,
    default : null
  }
});

//Created Model of the Todo Schema...
//To use the schema we use it through passing it to model
const Todo = mongoose.model('Todo',TodoSchema);


module.exports = {Todo};



//Code for creating and saving the data
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
