import mongoose from 'mongoose';
import Website from '../models/websiteModel.js';

const seedWebsites = async () => {
  try {
    // Clear existing websites
    await Website.deleteMany({});
    
    const userId = 'user_2vb5ZZMNpo1yBKkYTiL0jLW6fkd';
    
    const websites = [
      {
        url: 'https://www.google.com',
        userId,
        ticks: [
          {
            status: 'up',
            responseTime: 245,
            timestamp: new Date(Date.now() - 3600000) // 1 hour ago
          },
          {
            status: 'up',
            responseTime: 221,
            timestamp: new Date(Date.now() - 1800000) // 30 minutes ago
          }
        ]
      },
      {
        url: 'https://www.github.com',
        userId,
        ticks: [
          {
            status: 'up',
            responseTime: 543,
            timestamp: new Date(Date.now() - 3600000) // 1 hour ago
          },
          {
            status: 'up',
            responseTime: 489,
            timestamp: new Date(Date.now() - 1800000) // 30 minutes ago
          }
        ]
      },
      {
        url: 'https://www.example.com',
        userId,
        ticks: [
          {
            status: 'down',
            responseTime: 0,
            timestamp: new Date(Date.now() - 3600000) // 1 hour ago
          },
          {
            status: 'up',
            responseTime: 321,
            timestamp: new Date(Date.now() - 1800000) // 30 minutes ago
          }
        ]
      },
      {
        url: 'https://api.example.org',
        userId,
        ticks: [
          {
            status: 'up',
            responseTime: 189,
            timestamp: new Date(Date.now() - 3600000) // 1 hour ago
          },
          {
            status: 'down',
            responseTime: 0,
            timestamp: new Date(Date.now() - 1800000) // 30 minutes ago
          }
        ]
      },
      {
        url: 'https://status.io',
        userId,
        ticks: [
          {
            status: 'up',
            responseTime: 276,
            timestamp: new Date(Date.now() - 3600000) // 1 hour ago
          },
          {
            status: 'up',
            responseTime: 301,
            timestamp: new Date(Date.now() - 1800000) // 30 minutes ago
          }
        ]
      }
    ];
    
    await Website.insertMany(websites);
    console.log('Websites seeded successfully!');
    
  } catch (error) {
    console.error('Error seeding websites:', error);
  } finally {
    // Close the MongoDB connection
    mongoose.connection.close();
  }
};

// Connect to MongoDB and seed data
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://shekokarmahesh:Mda55yIgWFM8fvI6@statuspage.xabulrh.mongodb.net/?retryWrites=true&w=majority&appName=StatusPage')
  .then(() => {
    console.log('MongoDB connected successfully');
    seedWebsites();
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });