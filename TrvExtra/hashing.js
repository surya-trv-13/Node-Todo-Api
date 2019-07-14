const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bycrypt = require('bcryptjs');

var password = 'surya';
var encodedPassword = '$2a$10$HlWBjkP38ivqgijsRWcnTexGEXY2ag5DT9BDHIwpm1kUNu50uVVDK';


bycrypt.genSalt(10,(err,salt) => {
  bycrypt.hash(password,salt,(err,hash) => {
    //encodedPassword = hash
    // console.log(hash);
  });
});

bycrypt.compare(password,encodedPassword,(err,res) => {
  if(res){
    console.log('true');
  }else {
    console.log('false');
  }
});



// var data = {
//   name:  'The Real Virus - 13'
// };
//
// // This is implemetation of SHA256
// var hash = SHA256(JSON.stringify(data) + 'secret').toString();
// console.log(JSON.stringify(hash));
//
// // This is implemetation of jwt(Java Web Token)
// //This takes only the
// var token = jwt.sign(data, 'secret'); //This encode the message
//
// var user = jwt.verify(token,'secret'); // This decode the message and return the object
// console.log(`User Data ${JSON.stringify(user)}`);


// var message = 'Suryanarayan Rath';
// var hashed = SHA256(message + 'SecretMessage').toString() ;
//
// console.log('message : ',message);
// console.log(`hashed : ${hashed}`);
//
//
// var data = {
//   id : 5
// };
//
// // This is what user get to change with only the data property but a user can able to change the hash property
// var token = {
//   data,
//   hash : SHA256(JSON.stringify(data) + 'secret').toString()
// };
//
// token.data.id = 6;
// token.hash = SHA256(JSON.stringify(token.data.id)).toString();
//
//
// // For our checking or Matching purpose
// var hashMessage = SHA256(JSON.stringify(token.data) + 'secret').toString();
//
// if(token.hash === hashMessage){
//   console.log('Trust the user');
// }else{
//   console.log('Don\'t trust the user...');
// }
