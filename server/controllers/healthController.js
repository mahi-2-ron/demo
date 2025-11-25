const asyncHandler = require('../middleware/asyncHandler');

// @desc    Get system health status
// @route   GET /api/health
// @access  Public
const getHealth = asyncHandler(async (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

module.exports = { getHealth };