const asyncHandler = require('../middleware/asyncHandler');
const Donor = require('../models/Donor');

// @desc    Get current logged in donor profile
// @route   GET /api/donors/profile
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  const donor = await Donor.findById(req.user._id).select('-password');
  if (donor) {
    res.json(donor);
  } else {
    res.status(404);
    throw new Error('Donor not found');
  }
});

// @desc    Update donor profile
// @route   PUT /api/donors/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const donor = await Donor.findById(req.user._id);

  if (donor) {
    donor.fullName = req.body.fullName || donor.fullName;
    donor.phone = req.body.phone || donor.phone;
    donor.availability = req.body.availability !== undefined ? req.body.availability : donor.availability;
    donor.lastDonationDate = req.body.lastDonationDate || donor.lastDonationDate;
    
    // Update location if provided
    if (req.body.latitude && req.body.longitude) {
      donor.location = {
        type: 'Point',
        coordinates: [Number(req.body.longitude), Number(req.body.latitude)]
      };
    }

    if (req.body.password) {
      donor.password = req.body.password;
    }

    const updatedDonor = await donor.save();

    res.json({
      _id: updatedDonor._id,
      fullName: updatedDonor.fullName,
      email: updatedDonor.email,
      phone: updatedDonor.phone,
      bloodGroup: updatedDonor.bloodGroup,
      location: {
        latitude: updatedDonor.location.coordinates[1],
        longitude: updatedDonor.location.coordinates[0]
      },
      availability: updatedDonor.availability,
      token: req.headers.authorization.split(' ')[1] // Return existing token
    });
  } else {
    res.status(404);
    throw new Error('Donor not found');
  }
});

// @desc    Update donor location
// @route   PATCH /api/donors/update-location/:id
// @access  Private
const updateLocation = asyncHandler(async (req, res) => {
  const { latitude, longitude } = req.body;

  // Check if user is authorized to update this profile
  if (req.user._id.toString() !== req.params.id) {
    res.status(401);
    throw new Error('User not authorized to update this profile');
  }

  if (!latitude || !longitude) {
    res.status(400);
    throw new Error('Latitude and longitude are required');
  }

  const donor = await Donor.findById(req.params.id);

  if (donor) {
    // GeoJSON stores coordinates as [longitude, latitude]
    donor.location = {
      type: 'Point',
      coordinates: [Number(longitude), Number(latitude)]
    };

    const updatedDonor = await donor.save();

    res.json({
      _id: updatedDonor._id,
      fullName: updatedDonor.fullName,
      email: updatedDonor.email,
      phone: updatedDonor.phone,
      bloodGroup: updatedDonor.bloodGroup,
      location: {
        latitude: updatedDonor.location.coordinates[1],
        longitude: updatedDonor.location.coordinates[0]
      },
      availability: updatedDonor.availability,
    });
  } else {
    res.status(404);
    throw new Error('Donor not found');
  }
});

// @desc    Filter donors based on criteria
// @route   GET /api/donors/filter
// @access  Public
const filterDonors = asyncHandler(async (req, res) => {
  const { bloodGroup, available } = req.query;
  const query = {};

  // 1. Blood Group Filter
  if (bloodGroup && bloodGroup !== 'All') {
    query.bloodGroup = bloodGroup;
  }

  // 2. Availability Filter
  if (available) {
    query.availability = available === 'true';
  }

  // 3. Eligibility Filter (Exclude donors who donated within last 3 months)
  // Only apply if user strictly wants eligible donors, otherwise list all
  // For 'Find Donors' page, usually we show status, so we might return all and let frontend calculate eligibility color
  
  const donors = await Donor.find(query).select('-password');

  // Format response
  const formattedDonors = donors.map(donor => ({
    id: donor._id,
    name: donor.fullName,
    bloodGroup: donor.bloodGroup,
    phone: donor.phone,
    location: {
      latitude: donor.location.coordinates[1],
      longitude: donor.location.coordinates[0]
    },
    lastDonation: donor.lastDonationDate,
    availability: donor.availability,
    donationCount: donor.donationCount
  }));

  res.json(formattedDonors);
});

// @desc    Get nearby donors using Haversine formula (via MongoDB $geoNear)
// @route   GET /api/donors/nearby
// @access  Public
const getNearbyDonors = asyncHandler(async (req, res) => {
  const { lat, lng, radius = 10, bloodGroup } = req.query;

  if (!lat || !lng) {
    res.status(400);
    throw new Error('Latitude and longitude are required');
  }

  const query = { availability: true };
  if (bloodGroup && bloodGroup !== 'All') {
    query.bloodGroup = bloodGroup;
  }

  // Use MongoDB aggregation pipeline with $geoNear
  const donors = await Donor.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [parseFloat(lng), parseFloat(lat)]
        },
        distanceField: 'distance',
        maxDistance: parseFloat(radius) * 1000, // Convert km to meters
        spherical: true,
        query: query
      }
    },
    {
      $project: {
        _id: 1,
        fullName: 1,
        bloodGroup: 1,
        phone: 1,
        location: 1,
        distance: 1,
        availability: 1,
        lastDonationDate: 1,
        donationCount: 1
      }
    }
  ]);

  const formattedDonors = donors.map(donor => ({
    id: donor._id,
    name: donor.fullName,
    bloodGroup: donor.bloodGroup,
    phone: donor.phone,
    location: {
      latitude: donor.location.coordinates[1],
      longitude: donor.location.coordinates[0]
    },
    distance: (donor.distance / 1000).toFixed(2) + ' km',
    availability: donor.availability,
    lastDonation: donor.lastDonationDate,
    donations: donor.donationCount
  }));

  res.json(formattedDonors);
});

module.exports = { 
  getMe,
  updateProfile,
  updateLocation,
  filterDonors,
  getNearbyDonors
};