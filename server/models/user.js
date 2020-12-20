const mongoose = require('mongoose');
require('mongoose-type-email');

const Schema = mongoose.Schema;

const userschema = new Schema(
    {
       email: {
         type:mongoose.SchemaTypes.Email,
         required: true,
         index: { unique: true }
       },
       password: {
         type: String, 
         required: true 
       },
       isLoggedin:{
        type: Boolean,
        default: false
       },
       machineID: {
         type: mongoose.Schema.Types.ObjectId, 
         ref: 'Machine',
         required: true 
        },
        notify_cleaning:{
          type: Boolean,
          default: false
        },
        notify_battery:{
          type: Boolean,
          default: false
        },
       dateCreated:{
         type: Date,
         default: Date.now
       },
       profile_picture:{
         type: Object,
         default:{"fieldname":"file","originalname":"splash.png","encoding":"7bit","mimetype":"image/png","id":"5ef77a2982c7602fa4dd0a37","filename":"8a8e8f5544531e059f798a50e973569c.png","metadata":null,"bucketName":"profile_pictures","chunkSize":261120,"size":20629,"md5":"a4c5b2c3a6ef88e507f8423026326ccf","uploadDate":"2020-06-27T16:56:10.675Z","contentType":"image/png"} 
       },
       media:[
         {
           filename: {type: String},
           _id:{
            type:mongoose.Types.ObjectId,
          },
         }
       ]
    }
);


module.exports = User = mongoose.model('User', userschema);