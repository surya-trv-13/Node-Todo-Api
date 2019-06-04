const mongoose = require('mongoose');

//Connection to database using mongoose
//try to figure out the work behind the scene of the connect
mongoose.connect('mongodb://127.0.0.1:27017/TodoApp',{
  useNewUrlParser: true,
  useFindAndModify: false
});


module.exports = {mongoose};


//mongoose.Promise = global.Promise;
//No longer required
//Check - https://stackoverflow.com/questions/51862570/mongoose-why-we-make-mongoose-promise-global-promise-when-setting-a-mongoo
//-----------------------------------------------------------------------------
