const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');

const Schema = mongoose.Schema;

//Schema for Users collection
var UserSchema = new Schema({
  email : {
    type : String,
    required : true,
    trim : true,
    minlength : 5,
    unique : true,
    validiate : {
      validator : validator.isEmail,
      message : 'Email is Valid'
    }
  },
  password : {
    type : String,
    minlength : 3,
    required : true
  },
  tokens : [{
    access : {
      type : String,
      required : true
    },
    token : {
      type : String,
      required : true
    }
  }]
});

//This is to generate Authentication Token which will make token for the
//_id of the user database
UserSchema.methods.getAuthToken = function() {
  var user = this;    // This takes the user variable all the information of the user of that caller
  access = 'auth';    //this is the access value i.e. what is the token is for..
  token = jwt.sign({_id : user._id.toHexString(),access},'SecretMessage').toString();
  // ^This make the token to store the object containing the _id and access property encoding them

  user.tokens = user.tokens.concat([{access,token}]); // This pushes it to the array of tokens whic present in USerSchema

  // Now this is intresting... this returns the save and inside the save it returns a value
  // Similar to promise chaining...
  return user.save().then(() => {
    return token;
  });
}

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
