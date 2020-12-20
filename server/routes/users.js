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
const io = require('socket.io-client').io;
const express= require('express');
const router = express.Router();
const User = require('../models/user');
const Machine = require('../models/machine');
const Bcrypt = require("bcryptjs");
const jwt=require('jsonwebtoken');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const path = require('path');
const crypto = require('crypto');
const mongoose = require('mongoose');
const multer = require('multer');
var fs = require('fs')
http = require('http'),
socketio = require('socket.io'),
url = require("url");
// Create mongo connection
const mongoURI = 'mongodb+srv://Mominadar:oth009@database-sxhxy.mongodb.net/mern_database?retryWrites=true&w=majority';

const nodemailer = require("nodemailer");
const conn = mongoose.createConnection(mongoURI);

var gfs;

conn.once('open', () => {
  // Init stream
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('profile_pictures');
});

// Create storage engine
const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'profile_pictures'
        };
        resolve(fileInfo);
      });
    });
  }
});
const upload = multer({ storage });

var setpermission = function(req,res,next)
{  
    
        res.setHeader('Access-Control-Allow-Methods', '*')
    
        res.setHeader('Access-Control-Allow-Origin', '*')


res.setHeader('Access-Control-Allow-Headers', '*')        
        res.setHeader('Access-Control-Allow-Credentials', true);  
next();    
}







router.get('/dashboard', (request,response) =>
{
   
   response.send('dashboard')
     
});
//user login
router.post('/login', (request,response) =>
{
   User.findOne({
      email:request.body.email
  }).populate('machineID')
  .then(user=> {
        if(user)
        {
            
            Bcrypt.compare(request.body.password, user.password, function(err, res) {
                if(res) {
                 // Passwords match
                 const payload={
                    _id:user._id,
                    email:user.email,
                    
                  }
                  let token=jwt.sign(payload,process.env.SECRET_KEY)
                  console.log('Found user.')
                  gfs.files.findOne({ filename: user.profile_picture.filename }, (err, file) => {
                    // Check if file
                    if (!file || file.length === 0) {
                      return res.status(404).json({
                        err: 'No file exists'
                      });
                    }
                    //startServer();
                    user.isLoggedin = true;
                    user.save().then(user => console.log("")).catch((err)=>{throw err;});
                    response.send({user: user, token:token, file: file.filename,success:true})
                    
                  });
                 
                } else {
                 // Passwords don't match
                 //Passwords don't match
                 console.log('User does not exist') 
                response.json({error: 'User does not exist',success:false})
                } 
              });
          }
          else 
          {
              console.log('User does not exist')
              response.json({error: 'User does not exist',success:false})
          }

      })
    .catch(err=>
      {
          response.send('error: '+err)

      })
});
//user homescreen
router.get('/home', (request,response) =>
{
   var decoded =jwt.verify(request.headers['authorization'].split(' ')[1],process.env.SECRET_KEY)
    User.findOne({
        _id:decoded._id
    })
    .then(user => {
        if(user)
        {
            response.json(user)
        }
        else
        {
          response.send('User does not exist')
        }
    })
    .catch(err=>
        {
            response.send('error'+err)

        })
});
//user logout
router.post('/logout', (request,response) =>
{
   
   User.findOne({
      email:request.body.email
  }).then(user=> {
        if(user)
        {
            console.log('logged out.')
            user.isLoggedin = false;
            user.save().then(user => console.log("")).catch((err)=>{throw err;});
            response.send({success:true})
              
          }
          else 
          {
              console.log('User does not exist')
              response.json({error: 'User does not exist',success:false})
          }

      })
    .catch(err=>
      {
          response.send('error: '+err)

      })
});



//forget password
router.post('/forgot', (req,res) =>
{
  User.findOne({
    email:req.body.email
}).then(user=> {
      if(user)
      {
          user.password = "123456";
          user.password = Bcrypt.hashSync(user.password, 10);
          user.save().then(user => console.log("")).catch((err)=>{throw err;});
          const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'mominababar97@gmail.com',
              pass: 'LoveMama10' // naturally, replace both with your real credentials or an application-specific password
            }
          });
        
        const mailOptions = {
          from: 'cleanroomby@gmail.com',
          to: req.body.email,
          subject: 'Password Reset',
          text: 'Hello, your account password has been reset. It is now 123456. Login and update password. Thank you.'
        };
        
        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
          console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
            res.json({success:true})
          }
        });
          
            
        }
        else 
        {
            console.log('User does not exist')
            res.json({error: 'User does not exist',success:false})
        }

    })
  .catch(err=>
    {
        res.send('error: '+err)

    })
  

});



//user update
router.put('/update/',setpermission, function(req, res, next) {
  
  
  req.body.user.password = Bcrypt.hashSync(req.body.user.password, 10); 
  
   User.findOneAndUpdate({_id:req.body.user._id},req.body.user,function(error, results) {
   if (error) {
   return next(error);
   }
   console.log('Updated user');
   var a = req.body;
   a.user.password = Bcrypt.hashSync(a.user.password, 10); 
   
   res.json(a);
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
    alarms = [];
    results.alarms.forEach(element => {
      console.log(element.date.getTime());
      if(element.date.getTime()<currentdate.getTime()){
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

//view media
router.get('/getmedia/:id', (req,response) =>
{
  User.findById(req.params.id).exec(function(error, results) {
      if (error) {
          return next(error);
      }
      console.log('Got media');
      console.log(results.media);
      response.json(results.media);
  });
});
//save picture

//save video

//delete picture

//delete video

//view all user pctures and video

//add media

router.post('/media/:id', function(req, res, next) {
  User.findById(req.params.id).exec(function(error, result) {
    if (error) {
       
        return next(error);
    }
    console.log(req.body)
    req.body._id = mongoose.Types.ObjectId();
    result.media.push(req.body);
    result.save().then(user => console.log(user)).catch((err)=>{throw err;});
    
    // Respond with valid data
    console.log('Media added')
    res.json(result.media);
});
 });
//clear media
 router.post('/clearmedia/:id', function(req, res, next) {
  User.findById(req.params.id).exec(function(error, result) {
    if (error) {
       
        return next(error);
    }
    req.body._id = mongoose.Types.ObjectId();
    result.media = []
    result.save().then(user => console.log(user)).catch((err)=>{throw err;});
    
    // Respond with valid data
    console.log('Media cleared')
    res.json(result.media);
});
 });

//add alarm
router.post('/addalarm/:id', function(req, res, next) {
  console.log(req.body)
   Machine.findById(req.params.id).exec(function(error, result) {
     if (error) {
        
         return next(error);
     }
     req.body._id = mongoose.Types.ObjectId();
     result.alarms.push(req.body);
     result.save().then(user => console.log("Alarm Added")).catch((err)=>{throw err;});
     res.json(result);
 });
  });
//edit alarm
router.put('/editalarm/:id/alarm/:aid', function(req, res, next) {
  Machine.findById(req.params.id)
       .then((machine) => {
        console.log("found machine");
           res.statusCode = 200;
           res.setHeader('Content-Type', 'application/json');
           var newalarms = []
           
           machine.alarms.forEach(element => {
            if(element._id==req.params.aid){
              element = req.body;
              
            }
            newalarms.push(element)
            
          });
          machine.alarms = newalarms;
          console.log("edited alarm");
         machine.save().then(user => console.log(user)).catch((err)=>{throw err;});
          
          res.json(machine.alarms);
       
      
       
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
           machine.save().then(user => console.log(user)).catch((err)=>{throw err;});
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
           console.log(machine.alarms)
           machine.save().then(user => console.log(user)).catch((err)=>{throw err;});
           res.json({sucess: true});
          
       }, (err) => next(err))
       .catch((err) => next(err));
 
 });
//change settings
//cleaning complete notification
router.put('/settings/:id/clean', function(req, res, next) {
  User.findById(req.params.id)
       .then((user) => {
        console.log("found user");
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        user.notify_cleaning =  !user.notify_cleaning;
        
        user.save().then(user => console.log()).catch((err)=>{throw err;});
        console.log("updated clean");   
        res.json(user.notify_cleaning);
       
      
       
        } ).catch((err) => next(err));
 
 });
//battery low notification
router.put('/settings/:id/battery', function(req, res, next) {
  User.findById(req.params.id)
       .then((user) => {
       
        res.statusCode = 200;
        
        res.setHeader('Content-Type', 'application/json');
        user.notify_battery = !user.notify_battery;
        
        user.save().then(user => console.log()).catch((err)=>{throw err;});
        console.log("updated batery");  
        res.json(user.notify_battery);
       
      
       
        } ).catch((err) => next(err));
 
 });
//return settings
//clean
router.get('/settings/:id/clean', function(req, res, next) {
  User.findById(req.params.id)
       .then((user) => {
       
        res.statusCode = 200;
        
        res.setHeader('Content-Type', 'application/json');
        console.log(" clean returned ",user.notify_cleaning );
        res.json(user.notify_cleaning);
       
      
       
        } ).catch((err) => next(err));
 
 });
//battery
router.get('/settings/:id/battery', function(req, res, next) {
  User.findById(req.params.id)
       .then((user) => {
       
        res.statusCode = 200;
        
        res.setHeader('Content-Type', 'application/json');
        console.log("battery returned ",user.notify_battery );
        res.json(user.notify_battery);
       
      
       
        } ).catch((err) => next(err));
 
 });
//view cleaning progress

//view cleaning complete info

//move robot
router.get('/files', (req, res) => {
    
    gfs.files.find().toArray((err, files) => {
      // Check if files

    
      if (!files || files.length === 0) {
        return res.status(404).json({
          err
        });
      }
  
      // Files exist
      return res.json(files);
    });
  });
// @route GET /files/:filename
// @desc  Display single file object
router.get('/files/:filename', (req, res) => {
    gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
      // Check if file
      if (!file || file.length === 0) {
        return res.status(404).json({
          err
        });
      }
      // File exists
      return res.json(file);
    });
  });
  
  // @route GET /image/:filename
  // @desc Display Image
  router.get('/image/:filename', (req, res) => {
    gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
      // Check if file
      if (!file || file.length === 0) {
        return res.status(404).json({
          err: 'No file exists'
        });
      }
  
      // Check if image
      if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
        // Read output to browser
        const readstream = gfs.createReadStream(file.filename);
        readstream.pipe(res);
      } else {
        res.status(404).json({
          err: 'Not an image'
        });
      }
    });
  });
  
  // @route DELETE /files/:id
  // @desc  Delete file
  router.delete('/files/:id', (req, res) => {
    gfs.remove({ _id: req.params.id, root: 'uploads' }, (err, gridStore) => {
      if (err) {
        return res.status(404).json({ err: err });
      }
  
      res.redirect('/');
    });
  });
  
  //move robot
  router.post('/move/:id/dir/:dir', function(req, res, next) {
    Machine.findById(req.params.id).exec(function(error, result) {
      if (error) {
         
          return next(error);
      }
      console.log('Machine found')
      console.log("move machine: "+result.id+" in direction: "+req.params.dir);
      var move = req.params.dir;
      //serialPort.write(move);
      res.json(result);
  });
   });




module.exports = router;