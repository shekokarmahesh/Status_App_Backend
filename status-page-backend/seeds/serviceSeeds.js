import mongoose from 'mongoose';
import Service from '../models/Service.js';

const seedServices = async () => {
  try {
    // Clear existing services
    await Service.deleteMany({});
    
    const organizationId = 'org_2vbDBaAMaHtHqlx4chYu6Vaonj1';
    const userId = 'user_2vb5ZZMNpo1yBKkYTiL0jLW6fkd';
    
    const services = [
      {
        name: 'User Authentication API',
        description: 'Handles user login, registration, and authentication',
        status: 'operational',
        group: 'Backend Services',
        organizationId,
        createdBy: userId
      },
      {
        name: 'Payment Processing',
        description: 'Manages payment transactions and billing',
        status: 'degraded_performance',
        group: 'Billing Services',
        organizationId,
        createdBy: userId
      },
      {
        name: 'Main Website',
        description: 'Public-facing marketing website',
        status: 'operational',
        group: 'Frontend Services',
        organizationId,
        createdBy: userId
      },
      {
        name: 'Customer Dashboard',
        description: 'User dashboard for account management',
        status: 'operational',
        group: 'Frontend Services',
        organizationId,
        createdBy: userId
      },
      {
        name: 'Database Cluster',
        description: 'Primary database infrastructure',
        status: 'operational',
        group: 'Backend Services',
        organizationId,
        createdBy: userId
      },
      {
        name: 'Analytics Service',
        description: 'Tracks and processes user analytics',
        status: 'partial_outage',
        group: 'Backend Services',
        organizationId,
        createdBy: userId
      },
      {
        name: 'Email Notifications',
        description: 'Handles sending of all system emails',
        status: 'major_outage',
        group: 'Other',
        organizationId,
        createdBy: userId
      }
    ];
    
    await Service.insertMany(services);
    console.log('Services seeded successfully!');
    
  } catch (error) {
    console.error('Error seeding services:', error);
  } finally {
    // Close the MongoDB connection
    mongoose.connection.close();
  }
};

// Connect to MongoDB and seed data
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://shekokarmahesh:Mda55yIgWFM8fvI6@statuspage.xabulrh.mongodb.net/?retryWrites=true&w=majority&appName=StatusPage')
  .then(() => {
    console.log('MongoDB connected successfully');
    seedServices();
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });