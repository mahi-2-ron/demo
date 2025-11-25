const Donor = require('../models/Donor');

// Helper to determine which donor blood groups can donate to the requested recipient group
const getCompatibleDonorGroups = (recipientGroup) => {
  switch (recipientGroup) {
    case 'A+': return ['A+', 'A-', 'O+', 'O-'];
    case 'O+': return ['O+', 'O-'];
    case 'B+': return ['B+', 'B-', 'O+', 'O-'];
    case 'AB+': return ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    case 'A-': return ['A-', 'O-'];
    case 'O-': return ['O-'];
    case 'B-': return ['B-', 'O-'];
    case 'AB-': return ['AB-', 'A-', 'B-', 'O-'];
    default: return [recipientGroup]; // Fallback to exact match
  }
};

const notifyDonors = async (request) => {
  try {
    const { 
      bloodGroup, 
      location, 
      hospitalName, 
      unitsRequired, 
      requesterName 
    } = request;

    // 1. Determine compatible donor groups
    const targetGroups = getCompatibleDonorGroups(bloodGroup);

    // 2. Find donors within 10km (10,000 meters)
    // Note: Donor model must have a 2dsphere index on 'location'
    const donors = await Donor.find({
      bloodGroup: { $in: targetGroups },
      availability: true,
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: location.coordinates // [lng, lat]
          },
          $maxDistance: 10000 // 10km in meters
        }
      }
    });

    console.log(`[NotificationService] Found ${donors.length} potential donors for ${bloodGroup} request.`);

    // 3. Simulate sending alerts
    donors.forEach(donor => {
      // Prepare the message
      const message = `
        URGENT: ${bloodGroup} blood needed!
        Patient: ${requesterName}
        Hospital: ${hospitalName}
        Units: ${unitsRequired}
        Distance: ~${(calculateDistance(
          location.coordinates[1], location.coordinates[0],
          donor.location.coordinates[1], donor.location.coordinates[0]
        )).toFixed(1)} km away.
        Please accept in app if available.
      `.trim();

      // Placeholder for SMS/Email integration (e.g., Twilio, SendGrid)
      sendAlert(donor, message);
    });

  } catch (error) {
    console.error('[NotificationService] Error triggering alerts:', error);
  }
};

// Internal function to simulate sending (Console Log for now)
const sendAlert = (donor, message) => {
  console.log('--- SMS SIMULATION ---');
  console.log(`To: ${donor.fullName} (${donor.phone})`);
  console.log(`Msg: ${message}`);
  console.log('----------------------');
};

// Simple distance calc for the message text (Haversine approx)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

module.exports = { notifyDonors };