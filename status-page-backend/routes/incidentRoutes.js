import express from 'express';
import { requireAuth } from '@clerk/express';
import { requireOrganization } from '../middleware/auth.js';
import Incident from '../models/Incident.js';
import Service from '../models/Service.js';

const router = express.Router();

// All routes require authentication
router.use(requireAuth());

// Get all incidents for the current organization
router.get('/', requireOrganization, async (req, res) => {
  try {
    const { orgId } = req.auth;
    
    const incidents = await Incident.find({ organizationId: orgId })
      .populate('services', 'name status');
    res.json({ incidents });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new incident
router.post('/', requireOrganization, async (req, res) => {
  try {
    const { title, type, impact, serviceIds } = req.body;
    
    // Validate required fields
    if (!title || !type || !serviceIds || !Array.isArray(serviceIds) || serviceIds.length === 0) {
      return res.status(400).json({ 
        message: 'Missing required fields: title, type, and at least one serviceId' 
      });
    }
    
    const { userId, orgId } = req.auth;
    
    // Verify that all services belong to the organization
    const services = await Service.find({ 
      _id: { $in: serviceIds }, 
      organizationId: orgId 
    });
    
    if (services.length !== serviceIds.length) {
      return res.status(400).json({ message: 'Invalid service IDs provided' });
    }
    
    const incident = await Incident.create({
      title,
      type,
      impact,
      services: serviceIds,
      organizationId: orgId,
      createdBy: userId,
      updates: [{
        message: 'Incident created',
        status: 'investigating',
        createdBy: userId
      }]
    });
    
    res.status(201).json({ incident });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get a specific incident
router.get('/:id', requireOrganization, async (req, res) => {
  try {
    const { orgId } = req.auth;
    
    const incident = await Incident.findOne({ 
      _id: req.params.id,
      organizationId: orgId
    }).populate('services', 'name status');
    
    if (!incident) {
      return res.status(404).json({ message: 'Incident not found' });
    }
    
    res.json({ incident });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update an incident
router.patch('/:id', requireOrganization, async (req, res) => {
  try {
    const { status, impact } = req.body;
    const { userId, orgId } = req.auth;
    
    const incident = await Incident.findOneAndUpdate(
      { _id: req.params.id, organizationId: orgId },
      { 
        status, 
        impact,
        $push: { 
          updates: {
            message: `Incident updated to ${status}`,
            status,
            createdBy: userId
          }
        }
      },
      { new: true, runValidators: true }
    ).populate('services', 'name status');
    
    if (!incident) {
      return res.status(404).json({ message: 'Incident not found' });
    }
    
    res.json({ incident });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Add an update to an incident
router.post('/:id/updates', requireOrganization, async (req, res) => {
  try {
    const { message, status } = req.body;
    const { userId, orgId } = req.auth;
    
    const incident = await Incident.findOneAndUpdate(
      { _id: req.params.id, organizationId: orgId },
      { 
        $push: { 
          updates: {
            message,
            status,
            createdBy: userId
          }
        },
        status // Update the main incident status as well
      },
      { new: true, runValidators: true }
    ).populate('services', 'name status');
    
    if (!incident) {
      return res.status(404).json({ message: 'Incident not found' });
    }
    
    res.json({ incident });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
