import express from 'express';
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';
import { requireOrganization, requireAdmin } from '../middleware/auth.js';
import Service from '../models/service.js';

const router = express.Router();

// All routes require authentication
router.use(ClerkExpressRequireAuth());

// Get all services for the current organization
router.get('/', requireOrganization, async (req, res) => {
  try {
    const { orgId } = req.auth;
    
    const services = await Service.find({ organizationId: orgId });
    res.json({ services });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new service
router.post('/', requireOrganization, async (req, res) => {
  try {
    const { name, description } = req.body;
    const { userId, orgId } = req.auth;
    
    const service = await Service.create({
      name,
      description,
      status: 'operational',
      organizationId: orgId,
      createdBy: userId
    });
    
    res.status(201).json({ service });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get a specific service
router.get('/:id', requireOrganization, async (req, res) => {
  try {
    const { orgId } = req.auth;
    
    const service = await Service.findOne({ 
      _id: req.params.id,
      organizationId: orgId
    });
    
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    
    res.json({ service });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a service
router.patch('/:id', requireOrganization, async (req, res) => {
  try {
    const { name, description, status } = req.body;
    const { orgId } = req.auth;
    
    const service = await Service.findOneAndUpdate(
      { _id: req.params.id, organizationId: orgId },
      { name, description, status },
      { new: true, runValidators: true }
    );
    
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    
    res.json({ service });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a service
router.delete('/:id', requireOrganization, requireAdmin, async (req, res) => {
  try {
    const { orgId } = req.auth;
    
    const service = await Service.findOneAndDelete({ 
      _id: req.params.id,
      organizationId: orgId
    });
    
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
