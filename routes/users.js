var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var User = require('../models/user');
var userRouter = express.Router();
userRouter.use(bodyParser.json());

userRouter.get('/signup',(req,res,next) =>{

});

userRouter.post('/signup',(req,res,next) =>{
    User.findOne({username: req.body.username})
    .then((user) =>{
        if(user!=null){
            var err = new Error('User '+req.body.username+' already exists');
            err.status = 403;
            next(err);
        }
        else{
            return User.create({
                username: req.body.username,
                password: req.body.password
            });
        }

    })
    .then((user) =>{
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json({status: 'Registration Successful'});
    },(err) => next(err))
    .catch((err) => next(err));

});

userRouter.post('/login',(req,res,next) =>{
    if(!req.session.user){
        var authHeader = req.headers.authorization;
       if(!authHeader){
       var err = new Error('You are not authenticated!');
       res.setHeader('WWW-Authenticate','Basic');
       err.status = 401;
       next(err);
  }
  var auth = new Buffer(authHeader.split(' ')[1],'base64').toString().split(':');

  User.findOne({username: auth[0]})
  .then((user) =>{
      if(user===null){
        var err = new Error('User '+username+' does not exist');
        err.status = 403;
        next(err);

      }
      else if(user.password !== password){
        var err = new Error('Your password is incorrect');
        err.status = 403;
        next(err);

      }
    else if(auth[0]===user.username&&auth[1]===user.password){
        req.session.user = 'authenticated';
        res.statusCode = 200;
        res.setHeader('Content-Type','text/plain');
        res.end('You are authenticated successfully');
  }
  })
  .catch((err) => next(err));
}
else {
    res.statusCode = 200;
    res.setHeader('Content-Type','text/plain');
    res.end('You are already authenticated');
}
   
});

userRouter.get('/logout',(req,res) =>{
    if(req.session)
    {
        req.session.destroy();
        res.clearCookie('session-id');
        res.redirect('/');
    }
    else{
        var err = new Error('You are not logged in');
        err.status = 403;
        next(err);
    }

});


module.exports = userRouter;