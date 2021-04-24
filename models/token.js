const jwt = require('jsonwebtoken');

const token = async (req, res, next) =>{
   const token = req.headers['token'];
   if(token ==null){
      res.status(438).json(
         {message: 'Please login in'}
       )
   }
   jwt.verify(token, "secret_email", (err, user) =>{
      if(err){
         res.status(438).json(
            {message: 'Your session has expired. Please relogin'}
          )
      }
      req.user = user;
      next();
   })
}

module.exports = token;