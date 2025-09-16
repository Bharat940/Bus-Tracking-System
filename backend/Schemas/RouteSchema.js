const {Schema}= require("mongoose"); 

const RouteSchema = new Schema({
  name: { type: String, required: true },
  stops: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Stop' }],
  polyline: String, // this showes the entire path of the journy form A->B
  distanceKm: Number,
  schedule: [{
    tripStartTime: String,   // e.g. "08:30"
    EndTime: String,
  }],
  city: { type: String },
  active: { type: Boolean, default: true }
});


module.exports ={RouteSchema}