const mongoose = require('mongoose');

//Connection to database using mongoose
//try to figure out the work behind the scene of the connect
// process.env.MONGODB_URI is an Environment Variable which is used to get the heroku server for the connection
mongoose.connect(process.env.MONGODB_URI,{
  useNewUrlParser: true,
  useFindAndModify: false,
   useCreateIndex: true
});


module.exports = {mongoose};


//mongoose.Promise = global.Promise;
//No longer required
//Check - https://stackoverflow.com/questions/51862570/mongoose-why-we-make-mongoose-promise-global-promise-when-setting-a-mongoo
//-----------------------------------------------------------------------------
