const {Schema}= require("mongoose"); 


const UserSchema = new Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['admin', 'driver', 'commuter'],
    default: 'commuter'
  },
  assignedBus: { type: mongoose.Schema.Types.ObjectId, ref: 'Bus' },
  preferences: {
    lowBandwidth: { type: Boolean, default: false },
    favouriteRoutes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Route' }]
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports ={ UserSchema};