
const express = require('express');
const router = express.Router();
const {
  createCampaign,
  getCampaigns,
  getCampaignById,
  updateCampaign,
  deleteCampaign
} = require('../controllers/campaignController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, admin, createCampaign)
  .get(getCampaigns);

router.route('/:id')
  .get(getCampaignById)
  .put(protect, admin, updateCampaign)
  .delete(protect, admin, deleteCampaign);

module.exports = router;
