const {Schema}= require("mongoose"); 

const BusSchema = new Schema({
  busNumber:{type:String, required:true},
  capacity:{type:Number,required:true},
  currentLocation:{
    coordinates:{type:[Number],default:[0,0]}
  } ,// default apne hisab se set kar dena
  route: { type: mongoose.Schema.Types.ObjectId, ref: 'Route' },
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: {
    type: String,
    enum: ['active', 'inactive'],// this works as the radio botton 
    default: 'active'
  },
  lastUpdated: { type: Date, default: Date.now },
  occupancy: { type: Number, default: 0 },
  

});

module.exports={BusSchema};