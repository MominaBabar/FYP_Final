/*

List of routes for admin
1. Admin login                    +
2. Admin dashboard                +
3. add user                       +
4. add machine                    +
5. view all users                 +
6. view all machines              +
7. delete user                    +
8. delete machine                 +
9. update machine                 +
10. admin logout                  
11. update password

*/


const express= require('express');
const router = express.Router();
const Bcrypt = require("bcryptjs");
const User = require('./../models/user')
const Admin = require('./../models/admin')
const Machine = require('./../models/machine');

const path = require('path');
const crypto = require('crypto');
const mongoose = require('mongoose');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const fs = require('fs');
const jwt=require('jsonwebtoken');
const { response, request } = require('express');

var _ = require('lodash');
var formidable = require('formidable');



process.env.SECRET_KEY='secret';
const mongoURI = 'mongodb+srv://Mominadar:oth009@database-sxhxy.mongodb.net/mern_database?retryWrites=true&w=majority';
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
// Create mongo connection
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

/*
*********************************************************
                          ADMIN
*********************************************************
*/

//admin login
router.post('/login', (request,response) =>
{
   Admin.findOne({
      email:request.body.email
  })
  .then(admin => {
        if(admin)
        {
            if(request.body.password ===admin.password) 
            {
              
                const payload={
                  _id:admin._id,
                  email:admin.email,
                  
                }
                let token=jwt.sign(payload,process.env.SECRET_KEY, {
                    expiresIn:'24h'
                })
                console.log("found admin")
                response.send({token:token,success:true})
            }
            else 
            {
                //Passwords don't match
                console.log("Admin does not exist")
                response.json({error: ' Admin does not exist',success:false})
            }
          }
          else 
          {
              //Passwords don't match
              console.log("Admin does not exist")
              response.json({error: ' Admin does not exist',success:false})
          }

      })
    .catch(err=>
      {
          response.send('error: '+err)

      })
});
//dashboard
router.get('/dashboard', (request,response) =>
{
   var decoded =jwt.verify(request.headers['authorization'].split(' ')[1],process.env.SECRET_KEY)
    Admin.findOne({
        _id:decoded._id
    })
    .then(admin => {
        if(admin)
        {
            admin.isLoggedin = true;
            admin.save().then(user => console.log("user")).catch((err)=>{throw err;});
            response.json(admin)
        }
        else
        {
          response.send('Patient does not exist')
        }
    })
    .catch(err=>
        {
            response.send('error'+err)

        })
});

//admin logout
router.post('/logout/:id', (request,response) =>
{
  //console.log(request.body)
   Admin.findById(request.params.id)
  .then(admin => {
     admin.isLoggedin = false;
     admin.save().then(user => console.log("user")).catch((err)=>{throw err;});
     response.json(admin);
  })
    .catch(err=>
      {
          response.send('error: '+err)

      })
});
//get list
router.get('/list',setpermission, function(req, res, next) {
  console.log("Getting count...");
  count = {};
  count.usercount = 0;
  count.machinecount = 0;
  count.activeuser = 0;
  count.availmachines = 0;
  arr = []
  User.find({}).exec(function(error, results) {
    if (error) {
        return next(error);
    }
    arr[0] = results;
    count.usercount = results.length;
});
Machine.find({}).exec(function(error, results) {
  if (error) {
      return next(error);
  }
  arr[1] = results;
  count.machinecount = results.length;
});
  activecount = 0;
  availcount = 0;
  User.find({isLoggedin: true}).exec(function(error, results) {
    if (error) {
      response.json(error);
    }  
    arr[2] = results;
    count.activeuser = results.length;
   
  });
    Machine.find({available: true}).exec(function(error, results) {
      if (error){
        response.json(error);
      }
    
      count.availmachines = results.length;
      arr[3] = results;
      console.log(count);
      console.log("kkkk", arr);
      res.json(count);
});


});
//update password
router.put('/update/password/:id',setpermission, function(req, res, next) {
  request.body.password = Bcrypt.hashSync(request.body.password, 10);  
  Admin.findOneAndUpdate({_id:req.params.id},
    req.body,function(error, results) {
  if (error) {
  return next(error);
  }
  console.log('Updated password');
  res.json(results);
  });
});

//view all admins
router.get('/viewadmin', (request,response) =>
{
   Admin.find({}).exec(function(error, results) {
      if (error) {
          return next(error);
      }
      console.log('Got all admins');
      response.json(results);
  });
});
//delete admin
router.delete('/delete/admin/:id', function(req, res, next) {
  Admin.deleteOne({_id:req.params.id }, function(error, results) {
      if (error) {
          return next(error);
      }
      console.log('Deleted Admin');
      res.json(results);
  });
});
//update admin
router.put('/update/admin/:id',function(req, res, next) {
 //console.log(req.body);
  Admin.findOneAndUpdate({_id:req.params.id},req.body,function(error, results) {
  if (error) {
    res.json(error);
  }
  //console.log('Updated Admin details',results);
  res.json(results);
  });
});
router.post('/updated/admin/:id',upload.single('file'),function(req, res, next) {
  image1 = "";
  const readstream = gfs.createReadStream(req.file.filename);
    const bufs = []
    readstream.on('data', function (chunk) {
      bufs.push(chunk)
    })
    readstream.on('error', function (err) {
      console.log(err)
      res.send('No image found with that title')
    })
    readstream.on('close', function () {
      
      const fbuf = Buffer.concat(bufs)
      const img = fbuf.toString('base64')
      // const fbuf = Buffer.concat(bufs)
      // var img = new Buffer(fbuf, 'base64');

      res.writeHead(200, {
        'Content-Type': 'image/png',
        'Content-Length': img.length
      });
      //console.log(img);
      Admin.findOneAndUpdate({_id:req.params.id},{image:{data:img,contentType:req.file.contentType}},function(error, results) {
        if (error) {
          //res.json({error:error});
        }
        else{
          //console.log('Updated Admin details',req.file.filename);
          //res.json({success:true,image:{data:image1,contentType:req.file.contentType}});
        }
        
        });
      res.end(img);


    })
  
  
  
 
 
});
//add admin
router.post('/addadmin', upload.single('file'), (request,response) =>
{
   //request.body.password = Bcrypt.hashSync(request.body.password, 10);
   request.body.profile_picture = request.file;
   Admin.create(request.body)
        .then((result) => {
            console.log('Admin Added.');
            response.statusCode = 200;
            
            response.json(result);
        }, (err) => console.log(err))
        .catch((err) => console.log(err));     
});


/*
*********************************************************
                          USER
*********************************************************
*/


//add user
router.post('/adduser', (request,response) =>
{
   console.log("adding....");
   request.body.password = Bcrypt.hashSync(request.body.password, 10);
   var id = mongoose.Types.ObjectId(request.body.machineID);
   request.body.machineID = id;
   //console.log(request.body);
   User.create(request.body)
        .then((result) => {
            console.log('User Added.');
            Machine.findById(request.body.machineID).exec(function(error, results) {
              if (error){
                response.json(error);
              }
              results.available = false;
              results.save().then(user => console.log("user")).catch((err)=>{throw err;});

          });
            response.statusCode = 200;
            response.json(result);
        }, (err) => console.log(err))
        .catch((err) => console.log(err));   
        
    
});
//view users
router.get('/viewusers', (request,response) =>
{
   User.find({}).exec(function(error, results) {
      if (error) {
        response.json(error);
      }
      console.log('Got all Users');
      response.json(results);
  });
});
//view logged in users
router.get('/viewlogusers', (request,response) =>
{
   User.find({}).exec(function(error, results) {
      if (error) {
        response.json(error);
      }
      av = [];
      results.forEach(element => {
        if(element.isLoggedin==true){
          av.push(element);
        }
      });
      console.log('Got active Users');
      response.json(av);
  });
});
//remove user
router.delete('/delete/user/:id', function(req, res) {
    User.findById(req.params.id).exec(function(error, results) {
    if (error){
        return res.json(error);
    }
    console.log("found user.")
    Machine.findById(results.machineID).exec(function(error, result) {
      if (error){
        return res.json(error);
      }
      result.available = true;
      result.save().then(user => console.log(user)).catch((err)=>{throw err;});
      console.log('machine now available');
      });
      User.deleteOne({_id:req.params.id }, function(error, results1) {
        if (error) {
            return next(error);
      }
      console.log('Deleted User');
      res.json(results1);
      
    });
      
   });
 });

//clear all users
router.put('/clear/users',setpermission, function(req, res, next) {
  Machine.find({}).exec(function(error, results) {
    if (error) {
        res.json({success:false});
    }
    results.forEach(element => {
         element.available = true;
         element.save().then(user => r=1).catch((err)=>{throw err;});
       
      });

    });
    console.log("Made all machines available");
    User.remove({});
    console.log("Removed all users.");

    res.json({success:true});
   

});  



//update user
router.put('/user/update/',setpermission, function(req, res, next) {
  User.findById(req.body._id).exec(function(error, results) {
   if (error){
       return res.json(error);
   }
   console.log("found user.")
   var id = mongoose.Types.ObjectId(req.body.machineID);
   req.body.machineID = id;
     if(req.body.machineID!=results.machineID){
       Machine.findById(results.machineID).exec(function(error, result) {
         if (error){
           return res.json(error);

         }
         result.available = true;
         result.save().then(user => console.log(user)).catch((err)=>{throw err;});
         console.log('machine now available');
     });
     Machine.findById(req.body.machineID).exec(function(error, result) {
       if (error){
         return res.json(error);

       }
       result.available = false;
       result.save().then(user => console.log(user)).catch((err)=>{throw err;});
       console.log('machine now unavailable');
   });
   }
  User.findOneAndUpdate({_id:req.body._id},req.body,function(error, results) {
  if (error) {
  return next(error);
  }
  console.log('Updated user');
  
  res.json(results);
  });
})
});



/*
*********************************************************
                          MACHINE
*********************************************************
*/

//add machine
router.post('/addmachine', (request,response) =>
{
   
   Machine.create(request.body)
        .then((result) => {
            console.log('Machine Added.');
            response.statusCode = 200;
            response.setHeader('Content-Type', 'application/json');
            response.json(result);
        }, (err) => next(err))
        .catch((err) => next(err));   
   
    
});

//view all machines
router.get('/viewmachines', (request,response) =>
{
   Machine.find({}).exec(function(error, results) {
      if (error) {
          return next(error);
      }    
      console.log('Got all machines');
      response.json(results);
  });
});
//view available machines
router.get('/viewavailmachines', (request,response) =>
{
   Machine.find({}).exec(function(error, results) {
      if (error){
          return next(error);
      }
      
      av = []
      results.forEach(element => {
        if(element.available==true){
          av.push(element)
        }
      });
      console.log('Got all available machines');
      response.json(av);
    
  });
});

//remove machine
router.delete('/delete/machine/:id', function(req, res, next) {
  
  Machine.deleteOne({_id:req.params.id }, function(error, results) {
      if (error) {
          return next(error);
      }
      console.log('Deleted Machine');
      res.json(results);
  });
});

 //update machine
 router.put('/update/machine',setpermission, function(req, res, next) {
  
  Machine.findOneAndUpdate({_id:req.body._id},req.body,function(error, results) {
  if (error) {
  return next(error);
  }
  console.log('Updated Machine details');
  res.json(results);
  });
});
//clear all machines
router.put('/clear/machines',setpermission, function(req, res, next) {
  Machine.find({}).exec(function(error, results) {
    if (error) {
      res.json({success:false});
    }
    flag = true;
    results.forEach(element => {
         if(element.available== true){
          flag = false;
         }
      });
      if(flag==true){
        Machine.remove({});
          console.log('Removed all machines');
          res.json({success:true});

      }
      else{
        console.log('Some or all machines are in use. Cannot remove.');
          res.json({success:false});
      }


    });
    
   

});  

//make all machines available
//clear all users
router.put('/clear/avail',setpermission, function(req, res, next) {
  Machine.find({}).exec(function(error, results) {
    if (error) {
        return next(error);
    }
    results.forEach(element => {
         element.available = true;
         element.save().then(user => console.log(user)).catch((err)=>{throw err;});
       
      });

    });   

}); 
 //update machine
router.put('/machine/update/',setpermission, function(req, res, next) {
  Machine.findOneAndUpdate({_id:req.params.id},req.body,function(error, results) {
  if (error) {
  return next(error);
  }
  console.log('Updated Machine details');
  res.json(results);
  });
});

/*
*********************************************************
                          FILES
*********************************************************
*/

//upload file

router.post('/addpicture', upload.single('file'), (request,response) =>
{
   //request.body.password = Bcrypt.hashSync(request.body.password, 10);
            console.log('Picture uploaded.');
            response.statusCode = 200;
            response.json({status:'success'});
            
});
//view all files
router.get('/files', (req, res) => {
  gfs.files.find().toArray((err, files) => {
    // Check if files
    if (!files || files.length === 0) {
      res.render('index', { files: false });
    } else {
      files.map(file => {
        if (
          file.contentType === 'image/jpeg' ||
          file.contentType === 'image/png'
        ) {
          file.isImage = true;
        } else {
          file.isImage = false;
        }
      });
      res.json(files);
    }
  });

});

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
      console.log("got picture");
      readstream.on('data', (chunk) => {
        res.json({ image: chunk.toString('base64') });
      })
    } else {
      res.status(404).json({
        err: 'Not an image'
      });
    }
  });
});

router.get('/images/:filename', (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    // Check if file
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: 'No file exists'
      });
    }
    console.log("llllllkkkkkkkkkkkkkk")
    // Check if image
    if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
      // Read output to browser
    const readstream = gfs.createReadStream(file.filename);
    //  res.type('image/png');
    //  readstream.pipe(res);
    const bufs = []
    readstream.on('data', function (chunk) {
      bufs.push(chunk)
    })
    readstream.on('error', function (err) {
      console.log(err)
      res.send('No image found with that title')
    })



    readstream.on('close', function () {
      
      const fbuf = Buffer.concat(bufs)
      const img = fbuf.toString('base64')
      // const fbuf = Buffer.concat(bufs)
      // var img = new Buffer(fbuf, 'base64');

      res.writeHead(200, {
        'Content-Type': 'image/png',
        'Content-Length': img.length
      });
      //console.log(img);
      res.end(img);


    })


    } else {
      res.status(404).json({
        err: 'Not an image'
      });
    }
  });
});




router.get('/img/:id', (req, res) => {
  Admin.findOne({_id:req.params.id}).exec(function(error, results) {
    if (error) {
        return next(error);
    }    
    console.log('Got picture');
    res.json({image:results.image,email:results.email});
});
});


module.exports = router;