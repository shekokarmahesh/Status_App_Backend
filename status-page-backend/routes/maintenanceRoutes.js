import express from 'express';
import { requireAuth } from '@clerk/express';
import { requireOrganization } from '../middleware/auth.js';
import Maintenance from '../models/Maintenance.js';
import Service from '../models/Service.js';

const router = express.Router();

// All routes require authentication
router.use(requireAuth());

// Get all maintenance events for the current organization
router.get('/', requireOrganization, async (req, res) => {
  try {
    const { orgId } = req.auth;
    const { status } = req.query; // Allow filtering by status
    
    const query = { organizationId: orgId };
    if (status) {
      query.status = status;
    }
    
    const maintenanceEvents = await Maintenance.find(query)
      .populate('services', 'name status')
      .sort({ scheduledStartDate: -1 });
      
    res.json({ maintenanceEvents });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new maintenance event
router.post('/', requireOrganization, async (req, res) => {
  try {
    const { 
      title, 
      description,
      impact, 
      serviceIds,
      scheduledStartDate,
      scheduledEndDate,
      isPublic
    } = req.body;
    
    // Validate required fields
    if (!title || !description || !serviceIds || !scheduledStartDate || !scheduledEndDate) {
      return res.status(400).json({ 
        message: 'Missing required fields' 
      });
    }
    
    // Validate dates
    const startDate = new Date(scheduledStartDate);
    const endDate = new Date(scheduledEndDate);
    
    if (endDate <= startDate) {
      return res.status(400).json({
        message: 'End date must be after start date'
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
    
    const maintenance = await Maintenance.create({
      title,
      description,
      impact: impact || 'minor',
      services: serviceIds,
      organizationId: orgId,
      createdBy: userId,
      scheduledStartDate: startDate,
      scheduledEndDate: endDate,
      isPublic: isPublic !== undefined ? isPublic : true,
      updates: [{
        message: 'Maintenance scheduled',
        status: 'scheduled',
        createdBy: userId
      }]
    });
    
    res.status(201).json({ maintenance });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get a specific maintenance event
router.get('/:id', requireOrganization, async (req, res) => {
  try {
    const { orgId } = req.auth;
    
    const maintenance = await Maintenance.findOne({ 
      _id: req.params.id,
      organizationId: orgId
    }).populate('services', 'name status');
    
    if (!maintenance) {
      return res.status(404).json({ message: 'Maintenance event not found' });
    }
    
    res.json({ maintenance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a maintenance event
router.patch('/:id', requireOrganization, async (req, res) => {
  try {
    const { 
      title, 
      description,
      status, 
      impact,
      scheduledStartDate,
      scheduledEndDate,
      isPublic,
      serviceIds
    } = req.body;
    
    const { userId, orgId } = req.auth;
    
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (status !== undefined) updateData.status = status;
    if (impact !== undefined) updateData.impact = impact;
    if (scheduledStartDate !== undefined) updateData.scheduledStartDate = new Date(scheduledStartDate);
    if (scheduledEndDate !== undefined) updateData.scheduledEndDate = new Date(scheduledEndDate);
    if (isPublic !== undefined) updateData.isPublic = isPublic;
    if (serviceIds !== undefined) {
      // Verify services belong to org
      const services = await Service.find({ 
        _id: { $in: serviceIds }, 
        organizationId: orgId 
      });
      
      if (services.length !== serviceIds.length) {
        return res.status(400).json({ message: 'Invalid service IDs provided' });
      }
      
      updateData.services = serviceIds;
    }
    
    // Add status update if status changes
    if (status !== undefined) {
      updateData.$push = { 
        updates: {
          message: `Maintenance status updated to ${status}`,
          status,
          createdBy: userId
        }
      };
      
      // Set actual start/end dates based on status
      if (status === 'in_progress' && !updateData.actualStartDate) {
        updateData.actualStartDate = new Date();
      }
      if ((status === 'completed' || status === 'cancelled') && !updateData.actualEndDate) {
        updateData.actualEndDate = new Date();
      }
    }
    
    const maintenance = await Maintenance.findOneAndUpdate(
      { _id: req.params.id, organizationId: orgId },
      updateData,
      { new: true, runValidators: true }
    ).populate('services', 'name status');
    
    if (!maintenance) {
      return res.status(404).json({ message: 'Maintenance event not found' });
    }
    
    res.json({ maintenance });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Add an update to a maintenance event
router.post('/:id/updates', requireOrganization, async (req, res) => {
  try {
    const { message, status } = req.body;
    const { userId, orgId } = req.auth;
    
    if (!message || !status) {
      return res.status(400).json({ message: 'Message and status are required' });
    }
    
    const updateObj = { 
      $push: { 
        updates: {
          message,
          status,
          createdBy: userId
        }
      },
      status // Update the main maintenance status as well
    };
    
    // Set actual start/end dates based on status
    if (status === 'in_progress') {
      updateObj.actualStartDate = updateObj.actualStartDate || new Date();
    }
    if (status === 'completed' || status === 'cancelled') {
      updateObj.actualEndDate = updateObj.actualEndDate || new Date();
    }
    
    const maintenance = await Maintenance.findOneAndUpdate(
      { _id: req.params.id, organizationId: orgId },
      updateObj,
      { new: true, runValidators: true }
    ).populate('services', 'name status');
    
    if (!maintenance) {
      return res.status(404).json({ message: 'Maintenance event not found' });
    }
    
    res.json({ maintenance });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a maintenance event
router.delete('/:id', requireOrganization, async (req, res) => {
  try {
    const { orgId } = req.auth;
    
    const maintenance = await Maintenance.findOneAndDelete({ 
      _id: req.params.id,
      organizationId: orgId
    });
    
    if (!maintenance) {
      return res.status(404).json({ message: 'Maintenance event not found' });
    }
    
    res.json({ message: 'Maintenance event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;