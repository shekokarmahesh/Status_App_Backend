import mongoose from 'mongoose';
import Maintenance from '../models/Maintenance.js';
import Service from '../models/Service.js';
import dotenv from 'dotenv';

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/status-page')
  .then(() => console.log('MongoDB connected for seeding'))
  .catch(err => console.error('MongoDB connection error:', err));

// Sample service IDs - these should be replaced with actual service IDs from your database
const sampleServiceIds = [
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId()
];

// Organization ID and user ID
const organizationId = 'org_2vbDBaAMaHtHqlx4chYu6Vaonj1';
const userId = 'user_2vb5ZZMNpo1yBKkYTiL0jLW6fkd';

// Generate a future date for scheduled maintenance
const futureDateDays = (days) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
};

// Sample maintenance data
const maintenanceData = [
  // Scheduled future maintenance
  {
    title: 'Database Upgrade Maintenance',
    description: 'Upgrading database servers to the latest version for improved performance and security',
    status: 'scheduled',
    impact: 'minor',
    services: [sampleServiceIds[0], sampleServiceIds[1]],
    updates: [
      {
        message: 'Scheduled database maintenance will occur next week',
        status: 'scheduled',
        createdBy: userId,
        createdAt: new Date()
      }
    ],
    organizationId: organizationId,
    createdBy: userId,
    scheduledStartDate: futureDateDays(7),
    scheduledEndDate: futureDateDays(7.125), // 7 days + 3 hours
    isPublic: true
  },

  // In-progress maintenance
  {
    title: 'Network Infrastructure Updates',
    description: 'Upgrading network equipment to improve reliability and throughput',
    status: 'in_progress',
    impact: 'major',
    services: [sampleServiceIds[2]],
    updates: [
      {
        message: 'Network maintenance has been scheduled',
        status: 'scheduled',
        createdBy: userId,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24) // 1 day ago
      },
      {
        message: 'Network maintenance has begun',
        status: 'in_progress',
        createdBy: userId,
        createdAt: new Date() // Now
      }
    ],
    organizationId: organizationId,
    createdBy: userId,
    scheduledStartDate: new Date(),
    scheduledEndDate: futureDateDays(0.125), // 3 hours from now
    actualStartDate: new Date(),
    isPublic: true
  },

  // Completed maintenance
  {
    title: 'Security Patch Deployment',
    description: 'Deploying critical security patches to all systems',
    status: 'completed',
    impact: 'minor',
    services: [sampleServiceIds[0]],
    updates: [
      {
        message: 'Security patching scheduled for next Tuesday',
        status: 'scheduled',
        createdBy: userId,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7) // 7 days ago
      },
      {
        message: 'Security patching in progress',
        status: 'in_progress',
        createdBy: userId,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3) // 3 hours ago
      },
      {
        message: 'Security patches successfully deployed',
        status: 'completed',
        createdBy: userId,
        createdAt: new Date(Date.now() - 1000 * 60 * 30) // 30 minutes ago
      }
    ],
    organizationId: organizationId,
    createdBy: userId,
    scheduledStartDate: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
    scheduledEndDate: new Date(Date.now() - 1000 * 60 * 60 * 1), // 1 hour ago
    actualStartDate: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
    actualEndDate: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    isPublic: true
  },

  // Cancelled maintenance
  {
    title: 'API Gateway Migration',
    description: 'Migration to a new API gateway infrastructure',
    status: 'cancelled',
    impact: 'major',
    services: [sampleServiceIds[1], sampleServiceIds[2]],
    updates: [
      {
        message: 'API Gateway migration planned',
        status: 'scheduled',
        createdBy: userId,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5) // 5 days ago
      },
      {
        message: 'API Gateway migration cancelled due to vendor delays',
        status: 'cancelled',
        createdBy: userId,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2) // 2 days ago
      }
    ],
    organizationId: organizationId,
    createdBy: userId,
    scheduledStartDate: futureDateDays(3), // would have been 3 days from now
    scheduledEndDate: futureDateDays(3.25), // would have been 3 days + 6 hours from now
    actualEndDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // cancelled 2 days ago
    isPublic: false
  }
];

// Seed the database
const seedMaintenance = async () => {
  try {
    // Clear existing maintenance events
    await Maintenance.deleteMany({});
    console.log('Existing maintenance events deleted');

    // Insert new maintenance events
    await Maintenance.insertMany(maintenanceData);
    console.log('Maintenance events successfully seeded!');
    
    // Disconnect from database
    mongoose.disconnect();
    console.log('MongoDB disconnected after seeding');
  } catch (error) {
    console.error('Error seeding maintenance events:', error);
    mongoose.disconnect();
  }
};

seedMaintenance();