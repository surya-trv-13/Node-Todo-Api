const {Users} = require('./../model/user');

var authenticate = (req,res,next) => {
  var token = req.header('x-auth');

  Users.findByToken(token).then((result) => {
    if(result === null){
      res.status(401).send();
    }

    req.result = result;
    next();
  }).catch((e) => {
    res.status(401).send();
  });
};

module.exports = {
  authenticate
};
