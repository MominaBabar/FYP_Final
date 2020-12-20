/*

List of routes for user
1. user login
2. user homescreen
3. update user
4. user logout
5. view machine details
6. view machine cleaning history
7. save picture/video
8. delete picture/video
9. view pictures/video
10. add alarm
11. edit alarm
12. delete alarm
13. view cleaning progress
14. view cleaning complete info
15. move robot 


*/

const express= require('express');
const router = express.Router();
const User = require('../models/user');
const Machine = require('../models/machine');
const Bcrypt = require("bcryptjs");
const jwt=require('jsonwebtoken');

var mongoose = require('mongoose');



var setpermission = function(req,res,next)
{  
    
        res.setHeader('Access-Control-Allow-Methods', '*')
    
        res.setHeader('Access-Control-Allow-Origin', '*')


res.setHeader('Access-Control-Allow-Headers', '*')        
        res.setHeader('Access-Control-Allow-Credentials', true);  
next();    
}




//view machine history
router.get('/history/:id', (req,response) =>
{
   Machine.findById(req.params.id).exec(function(error, results) {
      if (error) {
          return next(error);
      }
      console.log('Got history',results);
      response.json(results.history);
  });
});
//add machine history
router.post('/addhistory/:id', function(req, res, next) {
    Machine.findById(req.params.id).exec(function(error, result) {
      if (error) {
         
          return next(error);
      }
      req.body._id = mongoose.Types.ObjectId();
      result.history.push(req.body);
      result.save().then(user => console.log(user)).catch((err)=>{throw err;});
      
      // Respond with valid data
      console.log('added')
      res.json(result);
  });
   }); 
//view machine details
router.get('/machine/:id', (req,response) =>
{
   Machine.findById(req.params.id).exec(function(error, results) {
      if (error) {
          return next(error);
      }
      console.log(results);
      response.json(results);
  });
});
//view machine history
router.get('/machine/:id', (req,response) =>
{
   Machine.findById(req.params.id).exec(function(error, results) {
      if (error) {
          return next(error);
      }
      console.log(results);
      response.json(results.history);
  });
});
//view machine alarms
router.get('/alarms/:id', (req,response) =>
{
   Machine.findById(req.params.id).exec(function(error, results) {
      if (error) {
          return next(error);
      }
      var currentdate = new Date();
      currentdate.setHours(currentdate.getHours()+5);
      alarms = [];
      results.alarms.forEach(element => {
        if(element.date<currentdate){
            //nothing
        }
        else{
            alarms.push(element)
        }
      });
      results.alarms  = alarms;
      results.save().then(user => console.log("Alarm Updated.")).catch((err)=>{throw err;});
      console.log('Got alarms');
      response.json(results.alarms);
  });
});

//add alarm
router.post('/addalarm/:id', function(req, res, next) {
    console.log(req.body);
   Machine.findById(req.params.id).exec(function(error, result) {
     if (error) {
        
         return next(error);
     }
     req.body._id = mongoose.Types.ObjectId();
     result.alarms.push(req.body);
     result.save().then(user => console.log("Alarm Added")).catch((err)=>{throw err;});
     
     // Respond with valid data
     res.json(result);
 });
  });
//edit alarm
router.put('/editalarm/:id/alarm/:aid', function(req, res, next) {
  Machine.findById(req.params.id)
       .then((machine) => {
           res.statusCode = 200;
           res.setHeader('Content-Type', 'application/json');
           machine.update({'alarms.id': req.params.aid}, {'$set': {
            'alarms.$.date': req.body.date,
            'alarms.$.status': req.body.status
        }}).then((result) => 
        {
         res.json(result);
      
        }).catch((err) => next(err));
           
        } ).catch((err) => next(err));
 
 });
//delete alarm
router.delete('/deletealarm/:id/alarm/:aid', function(req, res, next) {
  
   Machine.findById(req.params.id)
       .then((machine) => {
           res.statusCode = 200;
           res.setHeader('Content-Type', 'application/json');
           
          
           var ans = machine.alarms.filter(r=>r._id!=req.params.aid)
           machine.alarms = ans;
           console.log(machine.alarms)
           machine.save().then(user => console.log("Deleted alarm")).catch((err)=>{throw err;});
           res.json({sucess: true});
          
       }, (err) => next(err))
       .catch((err) => next(err));
 
 });
 //clear alarms
 router.delete('/deletealarms/:id', function(req, res, next) {
   
   Machine.findById(req.params.id)
       .then((machine) => {
           res.statusCode = 200;
           res.setHeader('Content-Type', 'application/json');
           
          
           machine.alarms = [];
           //console.log(machine.alarms)
           machine.save().then(user => console.log("cleared alarms")).catch((err)=>{throw err;});
           res.json({sucess: true});
          
       }, (err) => next(err))
       .catch((err) => next(err));
 
 });





module.exports = router;