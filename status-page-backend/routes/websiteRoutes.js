import express from 'express';
import { requireAuth } from '@clerk/express';
import Website from '../models/websiteModel.js';
import asyncHandler from '../utils/asyncHandler.js';
import fetch from 'node-fetch'; // Add this import

const router = express.Router();

// Register a website to monitor
router.post('/', requireAuth(), asyncHandler(async (req, res) => {
  const userId = req.auth.userId;
  const { url } = req.body;
  
  if (!url) {
    return res.status(400).json({ message: 'URL is required' });
  }
  
  const website = await Website.create({
    userId,
    url
  });
  
  res.status(201).json({
    id: website._id
  });
}));

// Get status of a specific website
router.get('/status', requireAuth(), asyncHandler(async (req, res) => {
  const websiteId = req.query.websiteId;
  const userId = req.auth.userId;
  
  if (!websiteId) {
    return res.status(400).json({ message: 'Website ID is required' });
  }
  
  const website = await Website.findOne({
    _id: websiteId,
    userId,
    disabled: false
  });
  
  if (!website) {
    return res.status(404).json({ message: 'Website not found' });
  }
  
  res.json(website);
}));

// List all websites for a user
router.get('/', asyncHandler(async (req, res) => {
  const userId = req.auth.userId;
  
  const websites = await Website.find({
    userId,
    disabled: false
  });
  
  res.json({
    websites
  });
}));

// Remove a website from monitoring (soft delete)
router.delete('/', requireAuth(), asyncHandler(async (req, res) => {
  const websiteId = req.body.websiteId;
  const userId = req.auth.userId;
  
  if (!websiteId) {
    return res.status(400).json({ message: 'Website ID is required' });
  }
  
  const website = await Website.findOneAndUpdate(
    {
      _id: websiteId,
      userId
    },
    {
      disabled: true
    },
    { new: true }
  );
  
  if (!website) {
    return res.status(404).json({ message: 'Website not found' });
  }
  
  res.json({
    message: 'Deleted website successfully'
  });
}));

// Ping all websites for a user
router.post('/ping', requireAuth(), asyncHandler(async (req, res) => {
  const userId = req.auth.userId;
  
  // Get all websites for the user
  const websites = await Website.find({ 
    userId,
    disabled: false 
  });
  
  // Ping each website
  for (const website of websites) {
    try {
      const startTime = Date.now();
      const response = await fetch(website.url, { 
        method: 'GET',
        timeout: 5000 // 5 second timeout
      });
      const responseTime = Date.now() - startTime;
      
      // Create a new tick with the status
      const tick = {
        timestamp: new Date(),
        status: response.ok ? 'up' : 'down',
        responseTime: responseTime
      };
      
      // Add the tick to the website's ticks array
      website.ticks.push(tick);
      await website.save();
    } catch (error) {
      // If fetch fails, mark as down
      const tick = {
        timestamp: new Date(),
        status: 'down',
        responseTime: 0 // Default value for failed requests
      };
      website.ticks.push(tick);
      await website.save();
    }
  }
  
  res.status(200).json({ message: 'All websites pinged successfully' });
}));

export default router;