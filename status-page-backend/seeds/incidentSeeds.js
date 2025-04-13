import mongoose from 'mongoose';
import Incident from '../models/Incident.js';
import Service from '../models/Service.js';
import dotenv from 'dotenv';

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/status-page')
  .then(() => console.log('MongoDB connected for seeding'))
  .catch(err => console.error('MongoDB connection error:', err));

// Sample service IDs - these should be replaced with actual service IDs from your database
// You'll need to either:
// 1. Query your services collection first and use real IDs
// 2. Create services first, then reference their IDs
const sampleServiceIds = [
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId()
];

// Organization ID and user ID
const organizationId = 'org_2vbDBaAMaHtHqlx4chYu6Vaonj1';
const userId = 'user_2vb5ZZMNpo1yBKkYTiL0jLW6fkd';

// Generate random past date within the last 30 days
const randomPastDate = (daysAgo = 30) => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo));
  return date;
};

// Generate a random future date within the next 7 days
const randomFutureDate = (daysAhead = 7) => {
  const date = new Date();
  date.setDate(date.getDate() + Math.floor(Math.random() * daysAhead) + 1);
  return date;
};

// Sample incidents data
const incidentData = [
  // Resolved incident
  {
    title: 'API Outage',
    type: 'incident',
    status: 'resolved',
    impact: 'major',
    services: [sampleServiceIds[0]],
    updates: [
      {
        message: 'We are investigating issues with our API services',
        status: 'investigating',
        createdBy: userId,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5) // 5 hours ago
      },
      {
        message: 'We have identified the root cause as a database connection issue',
        status: 'identified',
        createdBy: userId,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4) // 4 hours ago
      },
      {
        message: 'Fix has been deployed, monitoring systems',
        status: 'monitoring',
        createdBy: userId,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2) // 2 hours ago
      },
      {
        message: 'Services have been fully restored',
        status: 'resolved',
        createdBy: userId,
        createdAt: new Date(Date.now() - 1000 * 60 * 30) // 30 minutes ago
      }
    ],
    organizationId: organizationId,
    createdBy: userId,
    startDate: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    endDate: new Date(Date.now() - 1000 * 60 * 30) // 30 minutes ago
  },
  
  // Ongoing incident
  {
    title: 'Intermittent Login Issues',
    type: 'incident',
    status: 'monitoring',
    impact: 'minor',
    services: [sampleServiceIds[1]],
    updates: [
      {
        message: 'Some users are experiencing difficulties logging in',
        status: 'investigating',
        createdBy: userId,
        createdAt: new Date(Date.now() - 1000 * 60 * 90) // 90 minutes ago
      },
      {
        message: 'Issue identified as cache invalidation problem',
        status: 'identified',
        createdBy: userId,
        createdAt: new Date(Date.now() - 1000 * 60 * 60) // 60 minutes ago
      },
      {
        message: 'Fix deployed, monitoring for resolution',
        status: 'monitoring',
        createdBy: userId,
        createdAt: new Date(Date.now() - 1000 * 60 * 30) // 30 minutes ago
      }
    ],
    organizationId: organizationId,
    createdBy: userId,
    startDate: new Date(Date.now() - 1000 * 60 * 90), // 90 minutes ago
    endDate: null
  },
  
  // Planned maintenance
  {
    title: 'Scheduled Database Maintenance',
    type: 'maintenance',
    status: 'investigating',
    impact: 'minor',
    services: [sampleServiceIds[0], sampleServiceIds[2]],
    updates: [
      {
        message: 'Scheduled database maintenance will occur on April 15, 2025',
        status: 'investigating',
        createdBy: userId,
        createdAt: new Date()
      }
    ],
    organizationId: organizationId,
    createdBy: userId,
    startDate: randomFutureDate(),
    endDate: null
  },
  
  // Historical incident
  {
    title: 'Storage Service Degradation',
    type: 'incident',
    status: 'resolved',
    impact: 'critical',
    services: [sampleServiceIds[2]],
    updates: [
      {
        message: 'Critical storage service degradation detected',
        status: 'investigating',
        createdBy: userId,
        createdAt: randomPastDate(15)
      },
      {
        message: 'Identified hardware failure in primary storage array',
        status: 'identified',
        createdBy: userId,
        createdAt: new Date(new Date(randomPastDate(15)).getTime() + 1000 * 60 * 30)
      },
      {
        message: 'Failover to backup systems complete, monitoring performance',
        status: 'monitoring',
        createdBy: userId,
        createdAt: new Date(new Date(randomPastDate(15)).getTime() + 1000 * 60 * 90)
      },
      {
        message: 'Service fully restored with primary hardware replaced',
        status: 'resolved',
        createdBy: userId,
        createdAt: new Date(new Date(randomPastDate(15)).getTime() + 1000 * 60 * 240)
      }
    ],
    organizationId: organizationId,
    createdBy: userId,
    startDate: randomPastDate(15),
    endDate: new Date(new Date(randomPastDate(15)).getTime() + 1000 * 60 * 240)
  }
];

// Seed the database
const seedIncidents = async () => {
  try {
    // Clear existing incidents
    await Incident.deleteMany({});
    console.log('Existing incidents deleted');

    // Insert new incidents
    await Incident.insertMany(incidentData);
    console.log('Incidents successfully seeded!');
    
    // Disconnect from database
    mongoose.disconnect();
    console.log('MongoDB disconnected after seeding');
  } catch (error) {
    console.error('Error seeding incidents:', error);
    mongoose.disconnect();
  }
};

seedIncidents();