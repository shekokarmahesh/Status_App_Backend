import mongoose from 'mongoose';

const updateSchema = new mongoose.Schema({
  message: {
    type: String,
    required: [true, 'Update message is required'],
    trim: true
  },
  status: {
    type: String,
    enum: ['scheduled', 'in_progress', 'completed', 'cancelled'],
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

const maintenanceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Maintenance title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Maintenance description is required'],
    trim: true
  },
  status: {
    type: String,
    enum: ['scheduled', 'in_progress', 'completed', 'cancelled'],
    default: 'scheduled'
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
  scheduledStartDate: {
    type: Date,
    required: [true, 'Scheduled start date is required']
  },
  scheduledEndDate: {
    type: Date,
    required: [true, 'Scheduled end date is required']
  },
  actualStartDate: {
    type: Date
  },
  actualEndDate: {
    type: Date
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  notificationSent: {
    type: Boolean,
    default: false
  }
}, { 
  timestamps: true 
});

// Create indexes for faster queries
maintenanceSchema.index({ organizationId: 1, scheduledStartDate: -1 });
maintenanceSchema.index({ status: 1, scheduledStartDate: 1 });

const Maintenance = mongoose.model('Maintenance', maintenanceSchema);

export default Maintenance;