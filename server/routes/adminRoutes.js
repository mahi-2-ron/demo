const express = require('express');
const router = express.Router();
const {
  authAdmin,
  getDonors,
  deleteDonor,
  verifyDonor,
  getAllRequests,
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/login', authAdmin);
router.route('/donors').get(protect, admin, getDonors);
router.route('/donors/:id')
    .delete(protect, admin, deleteDonor)
    .put(protect, admin, verifyDonor);
router.route('/requests').get(protect, admin, getAllRequests);

module.exports = router;