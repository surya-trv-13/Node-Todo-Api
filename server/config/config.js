var env = process.env.NODE_ENV || 'development' ;

if(env === 'development' || env === 'test'){
  var config = require('./config.json');
  var envConfig = config[env]; //confi[env] will take whatever the value of env to envConfig that means ... if env is development it will draw all the keys of development and same for test

  Object.keys(envConfig).forEach((key) => {    //Object.keys takes the keys from the envConfig object and store all the values in a array..
    process.env[key] = envConfig[key]; // process.env[key] will be the keys in config that is MONGODB_URI or PORT ||| envConfig[key] will stpre the values to the keys and assigining to it...
  });
}




if(env === 'development'){
  process.env.PORT = 1200;
  process.env.MONGODB_URI = 'mongodb://127.0.0.1:27017/TodoApp';
}else if(env === 'test'){
  process.env.PORT = 1200;
  process.env.MONGODB_URI = 'mongodb://127.0.0.1:27017/TodoAppTest';
}
