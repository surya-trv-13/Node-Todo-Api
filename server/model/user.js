var mongoose = require('mongoose');
const Schema = mongoose.Schema;

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

module.exports = {Users};



//Creating and saving the data to database
// //Adding a user data
// var newUser = new Users({
//   email : 'suryanarayan88@outlook.com'
// });
//
// //Saving it to mongodb
// newUser.save().then((res) => {
//   console.log('Added a new User! ',res);
// }).catch((e) => {
//   console.log('Error found is ',e);
// });
