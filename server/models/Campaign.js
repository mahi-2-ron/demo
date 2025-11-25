
const mongoose = require('mongoose');

const campaignSchema = mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a campaign title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
  },
  location: {
    city: {
      type: String,
      required: [true, 'Please add a city'],
    },
    address: {
      type: String,
      required: [true, 'Please add a full address'],
    },
    coordinates: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        index: '2dsphere'
      }
    }
  },
  date: {
    type: Date,
    required: [true, 'Please add a date'],
  },
  time: {
    type: String, // e.g., "09:00 AM - 05:00 PM"
    required: [true, 'Please add timing'],
  },
  organizer: {
    type: String,
    required: [true, 'Please add organizer name'],
  },
  bloodGroupsNeeded: {
    type: [String],
    default: ['All Groups']
  },
  posterImageURL: {
    type: String,
    default: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=800&q=80'
  },
  type: {
    type: String,
    enum: ['Blood Drive', 'Emergency Camp', 'Awareness'],
    required: [true, 'Please specify campaign type'],
  },
  status: {
    type: String,
    enum: ['Upcoming', 'Ongoing', 'Completed'],
    default: 'Upcoming',
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Donor',
    required: true,
  }
}, {
  timestamps: true,
});

// Middleware to ensure coordinates are provided if needed logic exists
// (Optional validation hooks can be added here)

module.exports = mongoose.model('Campaign', campaignSchema);
