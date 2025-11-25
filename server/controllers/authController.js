const asyncHandler = require('../middleware/asyncHandler');
const Donor = require('../models/Donor');
const generateToken = require('../utils/generateToken');

// @desc    Register a new donor
// @route   POST /api/auth/register
// @access  Public
const registerDonor = asyncHandler(async (req, res) => {
  const { 
    fullName, 
    email, 
    password, 
    phone, 
    bloodGroup, 
    latitude, 
    longitude,
    lastDonationDate,
    availability,
    medicalHistory
  } = req.body;

  const userExists = await Donor.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Validate location
  if (!latitude || !longitude) {
    res.status(400);
    throw new Error('Location (latitude and longitude) is required');
  }

  const donor = await Donor.create({
    fullName,
    email,
    password,
    phone,
    bloodGroup,
    location: {
      type: 'Point',
      coordinates: [Number(longitude), Number(latitude)] // GeoJSON is [lng, lat]
    },
    lastDonationDate,
    availability: availability !== undefined ? availability : true,
    medicalHistory: medicalHistory || []
  });

  if (donor) {
    res.status(201).json({
      _id: donor._id,
      fullName: donor.fullName,
      email: donor.email,
      phone: donor.phone,
      bloodGroup: donor.bloodGroup,
      location: {
        latitude: donor.location.coordinates[1],
        longitude: donor.location.coordinates[0]
      },
      availability: donor.availability,
      token: generateToken(donor._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid donor data');
  }
});

// @desc    Auth donor & get token
// @route   POST /api/auth/login
// @access  Public
const loginDonor = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const donor = await Donor.findOne({ email });

  if (donor && (await donor.matchPassword(password))) {
    res.json({
      _id: donor._id,
      fullName: donor.fullName,
      email: donor.email,
      phone: donor.phone,
      bloodGroup: donor.bloodGroup,
      location: {
        latitude: donor.location.coordinates[1],
        longitude: donor.location.coordinates[0]
      },
      availability: donor.availability,
      isAdmin: donor.isAdmin,
      token: generateToken(donor._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

module.exports = {
  registerDonor,
  loginDonor,
};