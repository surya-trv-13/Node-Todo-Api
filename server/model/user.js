const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

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

// --------------------------------------------------------------------------------------------------------------
UserSchema.methods.toJSON = function() {  // This instance method is to send only the id and email property
  var user = this ;                       // This is called implicit within send if the method name is toJSON
  var userObject = user.toObject();       // else can call inside the send as send(user.toJSON) <- this

  return _.pick(userObject,['_id','email']);
}
// --------------------------------------------------------------------------------------------------------------
//This is to generate Authentication Token which will make token for the
//_id of the user database
UserSchema.methods.getAuthToken = function() {
  var user = this;    // This takes the user variable all the information of the user of that caller
  access = 'auth';    //this is the access value i.e. what is the token is for..
  token = jwt.sign({_id : user._id.toHexString(),access},process.env.JWT_SECRET).toString();
  // ^This make the token to store the object containing the _id and access property encoding them

  user.tokens = user.tokens.concat([{access,token}]); // This pushes it to the array of tokens whic present in USerSchema

  // Now this is intresting... this returns the save and inside the save it returns a value
  // Similar to promise chaining...
  return user.save().then(() => {
    return token;
  });
}
// --------------------------------------------------------------------------------------------------------------
// This is the method used for logOut here the user data base is updated by deleting a patrticular token...
// $pull is used to delete a element from the array
UserSchema.methods.logOut = function(token) {
  var user = this;

  return user.updateOne({
    $pull : {
      tokens : {token}
    }
  })
}
// --------------------------------------------------------------------------------------------------------------
// This is used to find the user using the x-auth token passed
// decode will decode the id property and it will passed through the findOne query
UserSchema.statics.findByToken = function(token) {
  var Users = this;
  var decode;

  try{
    decode = jwt.verify(token,process.env.JWT_SECRET);
  }catch(e){
    return new Promise((resolve,reject) => {
      reject();
    });
  }
  return Users.findOne({
    _id : decode._id,
    'tokens.token' : token,
    'tokens.access' : 'auth'
  })
};
// --------------------------------------------------------------------------------------------------------------
//This will take the email and password and check if there any user present
UserSchema.statics.findByCredential = function(email,password){
  var Users = this;

  return Users.findOne({email}).then((user) => {
    if(!user){
      return Promise.reject();
    }

    return new Promise((resolve,reject) => {
      bcrypt.compare(password,user.password,(err,res) => {    // This is the right way to compare the password with the hashed one ,| next , int the compare method we need to add the (<string containing password in it> and then <the hashed password in the database>).
        if(res){
          resolve(user);
        }else{
          reject();
        }
      });
    });
  });
}
// --------------------------------------------------------------------------------------------------------------
//This is MONGOOSE MIDDLEWARE which is used for the hashing the password...
//the pre method is used to get call before saving the data in the data base...
UserSchema.pre('save',function(next) {
    var user = this;

    if(user.isModified('password')){
      bcrypt.genSalt(10,(err,salt) => {
        bcrypt.hash(user.password,salt,(err,hash) => {
          user.password = hash;
          next();
        });
      });
    }else{
      next();
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
