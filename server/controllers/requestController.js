const asyncHandler = require('../middleware/asyncHandler');
const BloodRequest = require('../models/BloodRequest');
const { notifyDonors } = require('../utils/notificationService');

// @desc    Create new blood request
// @route   POST /api/requests
// @access  Public
const createRequest = asyncHandler(async (req, res) => {
  const {
    requesterName,
    requesterPhone,
    bloodGroup,
    unitsRequired,
    hospitalName,
    hospitalAddress,
    latitude,
    longitude,
    status,
    urgency
  } = req.body;

  if (!latitude || !longitude) {
    res.status(400);
    throw new Error('Location (latitude and longitude) is required');
  }

  const request = await BloodRequest.create({
    requesterName,
    requesterPhone,
    bloodGroup,
    unitsRequired,
    hospitalName,
    hospitalAddress,
    location: {
      type: 'Point',
      coordinates: [Number(longitude), Number(latitude)]
    },
    status: status || 'pending',
    // Link user if authenticated, but allow anonymous requests
    requesterId: req.user ? req.user._id : undefined
  });

  // Trigger notification to nearby compatible donors asynchronously
  notifyDonors(request);

  res.status(201).json(request);
});

// @desc    Get all blood requests
// @route   GET /api/requests
// @access  Public
const getRequests = asyncHandler(async (req, res) => {
  const requests = await BloodRequest.find({}).sort({ createdAt: -1 });
  res.json(requests);
});

// @desc    Get requests near a location
// @route   GET /api/requests/nearby
// @access  Public
const getNearbyRequests = asyncHandler(async (req, res) => {
  const { lat, lng, radius = 50 } = req.query; // Default radius 50km for requests

  if (!lat || !lng) {
    res.status(400);
    throw new Error('Latitude and longitude are required');
  }

  const requests = await BloodRequest.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [parseFloat(lng), parseFloat(lat)]
        },
        distanceField: 'distance',
        maxDistance: parseFloat(radius) * 1000,
        spherical: true,
        query: { status: { $ne: 'completed' } } // Show pending and matched
      }
    }
  ]);

  // Transform distance to km
  const formattedRequests = requests.map(req => ({
    ...req,
    distance: (req.distance / 1000).toFixed(1) + ' km'
  }));

  res.json(formattedRequests);
});

// @desc    Get single blood request
// @route   GET /api/requests/:id
// @access  Public
const getRequestById = asyncHandler(async (req, res) => {
  const request = await BloodRequest.findById(req.params.id);

  if (request) {
    res.json(request);
  } else {
    res.status(404);
    throw new Error('Request not found');
  }
});

// @desc    Update request status
// @route   PATCH /api/requests/:id
// @access  Private
const updateRequestStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const request = await BloodRequest.findById(req.params.id);

  if (request) {
    request.status = status || request.status;
    const updatedRequest = await request.save();
    res.json(updatedRequest);
  } else {
    res.status(404);
    throw new Error('Request not found');
  }
});

module.exports = {
  createRequest,
  getRequests,
  getNearbyRequests,
  getRequestById,
  updateRequestStatus
};