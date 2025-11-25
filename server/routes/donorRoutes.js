const express = require('express');
const router = express.Router();
const { 
  getMe, 
  updateProfile, 
  updateLocation, 
  filterDonors, 
  getNearbyDonors 
} = require('../controllers/donorController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/filter', filterDonors);
router.get('/nearby', getNearbyDonors);

// Protected routes
router.get('/profile', protect, getMe);
router.put('/profile', protect, updateProfile);
router.patch('/update-location/:id', protect, updateLocation);

module.exports = router;