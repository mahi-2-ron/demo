const asyncHandler = require('../middleware/asyncHandler');
const Donor = require('../models/Donor');
const BloodRequest = require('../models/BloodRequest');
const generateToken = require('../utils/generateToken');

// @desc    Auth admin & get token
// @route   POST /api/admin/login
// @access  Public
const authAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await Donor.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    if (user.isAdmin) {
      res.json({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
    } else {
        res.status(401);
        throw new Error('Not authorized as an admin');
    }
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Get all donors
// @route   GET /api/admin/donors
// @access  Private/Admin
const getDonors = asyncHandler(async (req, res) => {
  const donors = await Donor.find({}).select('-password');
  res.json(donors);
});

// @desc    Delete donor
// @route   DELETE /api/admin/donors/:id
// @access  Private/Admin
const deleteDonor = asyncHandler(async (req, res) => {
  const donor = await Donor.findById(req.params.id);

  if (donor) {
    await donor.deleteOne();
    res.json({ message: 'Donor removed' });
  } else {
    res.status(404);
    throw new Error('Donor not found');
  }
});

// @desc    Verify donor
// @route   PUT /api/admin/donors/:id
// @access  Private/Admin
const verifyDonor = asyncHandler(async (req, res) => {
  const donor = await Donor.findById(req.params.id);

  if (donor) {
    donor.isVerified = true;
    const updatedDonor = await donor.save();

    res.json({
      _id: updatedDonor._id,
      fullName: updatedDonor.fullName,
      email: updatedDonor.email,
      isVerified: updatedDonor.isVerified,
    });
  } else {
    res.status(404);
    throw new Error('Donor not found');
  }
});

// @desc    Get all blood requests
// @route   GET /api/admin/requests
// @access  Private/Admin
const getAllRequests = asyncHandler(async (req, res) => {
  const requests = await BloodRequest.find({}).populate('requesterId', 'fullName email phone');
  res.json(requests);
});

module.exports = {
  authAdmin,
  getDonors,
  deleteDonor,
  verifyDonor,
  getAllRequests,
};