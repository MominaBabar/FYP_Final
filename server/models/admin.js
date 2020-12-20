const { decodeBase64 } = require('bcryptjs');
const { Binary } = require('mongodb');
const mongoose = require('mongoose');
require('mongoose-type-email');

const Schema = mongoose.Schema;

const adminschema = new Schema(
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
        profile_picture:{
        type: Object,
        required: true,
        default:{"fieldname":"file","originalname":"splash.png","encoding":"7bit","mimetype":"image/png","id":"5ef77a2982c7602fa4dd0a37","filename":"8a8e8f5544531e059f798a50e973569c.png","metadata":null,"bucketName":"profile_pictures","chunkSize":261120,"size":20629,"md5":"a4c5b2c3a6ef88e507f8423026326ccf","uploadDate":"2020-06-27T16:56:10.675Z","contentType":"image/png"} 
      },
      isLoggedin:{
        type:Boolean,
        default:false
      },
      Aboutme:{
        type: String, 
        required: true,
        default: "Hello, I am a Final Year Bachelor student in COMSATS University Islamabad. 'Clean Roomby' is my FYP. It will clean your house for you."
      
      },
      image: {
        data: String,
        contentType: String
      },
      profile_image: {
        type:String,
        default: "1.png"
      },

       
    }
);


module.exports = User = mongoose.model('Admin', adminschema);