const express = require('express');
const router = express.Router();
const {
  createRequest,
  getRequests,
  getNearbyRequests,
  getRequestById,
  updateRequestStatus
} = require('../controllers/requestController');
const { protect } = require('../middleware/authMiddleware');

// Public routes for emergency access
router.route('/')
  .post(createRequest)
  .get(getRequests);

router.get('/nearby', getNearbyRequests);

router.route('/:id')
  .get(getRequestById)
  .patch(protect, updateRequestStatus); // Protect status updates

module.exports = router;