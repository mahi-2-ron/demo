const mongoose = require('mongoose');

const bloodRequestSchema = mongoose.Schema({
  requesterName: {
    type: String,
    required: [true, 'Please add a requester name'],
  },
  requesterPhone: {
    type: String,
    required: [true, 'Please add a phone number'],
  },
  bloodGroup: {
    type: String,
    required: [true, 'Please specify blood group'],
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
  },
  unitsRequired: {
    type: Number,
    required: [true, 'Please specify units required'],
    min: 1,
  },
  hospitalName: {
    type: String,
    required: [true, 'Please add hospital name'],
  },
  hospitalAddress: {
    type: String,
    required: [true, 'Please add hospital address'],
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
      index: '2dsphere'
    }
  },
  status: {
    type: String,
    enum: ['pending', 'matched', 'completed'],
    default: 'pending',
  },
  requesterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Donor',
    required: false
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model('BloodRequest', bloodRequestSchema);