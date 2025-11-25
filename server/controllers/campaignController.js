
const asyncHandler = require('../middleware/asyncHandler');
const Campaign = require('../models/Campaign');

// Helper to update campaign statuses based on date
const updateCampaignStatuses = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Mark past campaigns as Completed
  await Campaign.updateMany(
    { date: { $lt: today }, status: { $ne: 'Completed' } },
    { $set: { status: 'Completed' } }
  );

  // Mark today's campaigns as Ongoing
  await Campaign.updateMany(
    { date: { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) }, status: { $ne: 'Ongoing' } },
    { $set: { status: 'Ongoing' } }
  );
  
  // Mark future campaigns as Upcoming (in case dates were changed)
  // Logic omitted for performance, assuming creation handles future dates correctly
};

// @desc    Create a new campaign
// @route   POST /api/campaigns
// @access  Private/Admin
const createCampaign = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    city,
    address,
    latitude,
    longitude,
    date,
    time,
    organizer,
    bloodGroupsNeeded,
    posterImageURL,
    type
  } = req.body;

  // Basic Validation
  if (!latitude || !longitude) {
    res.status(400);
    throw new Error('Location coordinates (latitude & longitude) are required');
  }

  // Determine initial status based on date
  const campaignDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  let initialStatus = 'Upcoming';
  if (campaignDate < today) initialStatus = 'Completed';
  else if (campaignDate.getTime() === today.getTime()) initialStatus = 'Ongoing';

  const campaign = await Campaign.create({
    title,
    description,
    location: {
      city,
      address,
      coordinates: {
        type: 'Point',
        coordinates: [Number(longitude), Number(latitude)]
      }
    },
    date,
    time,
    organizer,
    bloodGroupsNeeded: bloodGroupsNeeded || ['All Groups'],
    posterImageURL,
    type,
    status: initialStatus,
    createdBy: req.user._id
  });

  res.status(201).json(campaign);
});

// @desc    Get all campaigns (with filters)
// @route   GET /api/campaigns
// @access  Public
const getCampaigns = asyncHandler(async (req, res) => {
  // Run auto-status update before fetching
  await updateCampaignStatuses();

  const { city, type, date, status } = req.query;
  const query = {};

  if (city) {
    query['location.city'] = { $regex: city, $options: 'i' };
  }

  if (type && type !== 'All') {
    query.type = type;
  }

  if (status && status !== 'All') {
    query.status = status;
  }

  if (date) {
    // Match specific date
    const queryDate = new Date(date);
    const nextDay = new Date(queryDate);
    nextDay.setDate(nextDay.getDate() + 1);
    
    query.date = {
      $gte: queryDate,
      $lt: nextDay
    };
  }

  const campaigns = await Campaign.find(query).sort({ date: 1 }); // Sort by nearest date first

  // Transform for frontend if needed, or send as is
  const formattedCampaigns = campaigns.map(c => ({
    id: c._id,
    title: c.title,
    description: c.description,
    organizer: c.organizer,
    type: c.type,
    date: c.date.toISOString().split('T')[0],
    time: c.time,
    location: c.location.address,
    city: c.location.city,
    coordinates: c.location.coordinates.coordinates,
    image: c.posterImageURL,
    status: c.status,
    bloodGroups: c.bloodGroupsNeeded
  }));

  res.json(formattedCampaigns);
});

// @desc    Get campaign details
// @route   GET /api/campaigns/:id
// @access  Public
const getCampaignById = asyncHandler(async (req, res) => {
  const campaign = await Campaign.findById(req.params.id);

  if (campaign) {
    res.json(campaign);
  } else {
    res.status(404);
    throw new Error('Campaign not found');
  }
});

// @desc    Update campaign
// @route   PUT /api/campaigns/:id
// @access  Private/Admin
const updateCampaign = asyncHandler(async (req, res) => {
  const campaign = await Campaign.findById(req.params.id);

  if (!campaign) {
    res.status(404);
    throw new Error('Campaign not found');
  }

  // Handle nested location updates manually if provided
  if (req.body.city || req.body.address || (req.body.latitude && req.body.longitude)) {
    campaign.location.city = req.body.city || campaign.location.city;
    campaign.location.address = req.body.address || campaign.location.address;
    if (req.body.latitude && req.body.longitude) {
      campaign.location.coordinates.coordinates = [Number(req.body.longitude), Number(req.body.latitude)];
    }
  }

  // Update other top-level fields
  campaign.title = req.body.title || campaign.title;
  campaign.description = req.body.description || campaign.description;
  campaign.date = req.body.date || campaign.date;
  campaign.time = req.body.time || campaign.time;
  campaign.organizer = req.body.organizer || campaign.organizer;
  campaign.bloodGroupsNeeded = req.body.bloodGroupsNeeded || campaign.bloodGroupsNeeded;
  campaign.posterImageURL = req.body.posterImageURL || campaign.posterImageURL;
  campaign.type = req.body.type || campaign.type;
  campaign.status = req.body.status || campaign.status;

  const updatedCampaign = await campaign.save();
  res.json(updatedCampaign);
});

// @desc    Delete campaign
// @route   DELETE /api/campaigns/:id
// @access  Private/Admin
const deleteCampaign = asyncHandler(async (req, res) => {
  const campaign = await Campaign.findById(req.params.id);

  if (campaign) {
    await campaign.deleteOne();
    res.json({ message: 'Campaign removed' });
  } else {
    res.status(404);
    throw new Error('Campaign not found');
  }
});

module.exports = {
  createCampaign,
  getCampaigns,
  getCampaignById,
  updateCampaign,
  deleteCampaign
};
