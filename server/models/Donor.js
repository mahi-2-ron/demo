const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const donorSchema = mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Please add a full name'],
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
  },
  phone: {
    type: String,
    required: [true, 'Please add a phone number'],
  },
  bloodGroup: {
    type: String,
    required: [true, 'Please specify blood group'],
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
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
  lastDonationDate: {
    type: Date,
  },
  donationCount: {
    type: Number,
    default: 0
  },
  medicalHistory: {
    type: [String],
    default: []
  },
  availability: {
    type: Boolean,
    default: true,
  },
  isAdmin: {
    type: Boolean,
    required: true,
    default: false,
  },
  isVerified: {
    type: Boolean,
    default: false,
  }
}, {
  timestamps: true,
});

// Match user entered password to hashed password in database
donorSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Encrypt password using bcrypt before saving
donorSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model('Donor', donorSchema);