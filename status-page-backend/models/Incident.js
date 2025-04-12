import mongoose from 'mongoose';

const updateSchema = new mongoose.Schema({
  message: {
    type: String,
    required: [true, 'Update message is required'],
    trim: true
  },
  status: {
    type: String,
    enum: ['investigating', 'identified', 'monitoring', 'resolved'],
    required: [true, 'Status is required']
  },
  createdBy: {
    type: String,
    required: [true, 'Creator ID is required']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const incidentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Incident title is required'],
    trim: true
  },
  type: {
    type: String,
    enum: ['incident', 'maintenance'],
    default: 'incident'
  },
  status: {
    type: String,
    enum: ['investigating', 'identified', 'monitoring', 'resolved'],
    default: 'investigating'
  },
  impact: {
    type: String,
    enum: ['none', 'minor', 'major', 'critical'],
    default: 'minor'
  },
  services: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: [true, 'At least one service must be affected']
  }],
  updates: [updateSchema],
  organizationId: {
    type: String,
    required: [true, 'Organization ID is required'],
    index: true
  },
  createdBy: {
    type: String,
    required: [true, 'Creator ID is required']
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date
  }
}, { 
  timestamps: true 
});

// Create index for faster queries
incidentSchema.index({ organizationId: 1, startDate: -1 });

const Incident = mongoose.model('Incident', incidentSchema);

export default Incident;
