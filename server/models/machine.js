const mongoose = require('mongoose');
const { Timestamp } = require('mongodb');

const Schema = mongoose.Schema;

const machineschema = new Schema(
    {
       ip_address:{
         type:String,
         default:"192.168.0.112",
         required:true,
         index: { unique: true }
       },
       avg_speed: {
         type:String,
         required: true,
         default: '2m/s'
       },
       battery:{
           type: Number,
           default:100
       },
       available:{
        type:Boolean,
        required: true,
        default:true
       },
       history:[
           {
              date:{
                type: Date,
                required: true,
                default: Date.now()
              },
              status:{
                  type: String,
                  required: true,
              },
              reason_of_failure:{
                  type:String,
              },
              area:{
                type: String,
                default:"20m sq"
              },
              distance:{
                type: String,
                default:"40m"
              },
              time:{
                type: String,
                default:"1 hour"
              },
              expand:{
                  type:Boolean,
                  default:false,
                  required: true,
              }

           }

       ],
      alarms:[
        {
           _id:{
              type:mongoose.Types.ObjectId,
            }, 
           date:{
             type: Date,
             required: true,
           },
           
           status:{
               type: Boolean,
               required: true,
           },
           
        }

    ]

       
    }
);


module.exports = User = mongoose.model('Machine', machineschema);