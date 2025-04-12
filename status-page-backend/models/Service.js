import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Service name is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['operational', 'degraded_performance', 'partial_outage', 'major_outage'],
    default: 'operational'
  },
  organizationId: {
    type: String,
    required: [true, 'Organization ID is required'],
    index: true
  },
  createdBy: {
    type: String,
    required: [true, 'Creator ID is required']
  }
}, { 
  timestamps: true 
});

// Create compound index for faster queries
serviceSchema.index({ organizationId: 1, name: 1 }, { unique: true });

const Service = mongoose.model('Service', serviceSchema);

export default Service;
