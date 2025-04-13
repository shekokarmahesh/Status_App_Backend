import mongoose from 'mongoose';

const tickSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ['up', 'down'],
    required: true
  },
  responseTime: {
    type: Number,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const websiteSchema = new mongoose.Schema({
  url: {
    type: String,
    required: [true, 'URL is required'],
    trim: true
  },
  userId: {
    type: String,
    required: [true, 'User ID is required']
  },
  disabled: {
    type: Boolean,
    default: false
  },
  ticks: [tickSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

websiteSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Website = mongoose.model('Website', websiteSchema);

export default Website;