import express from 'express';
import { requireAuth } from '@clerk/express';
import { requireOrganization, requireAdmin } from '../middleware/auth.js';
import Service from '../models/Service.js';

const router = express.Router();

// All routes require authentication
router.use(requireAuth());

// Get all services for the current organization
router.get('/', requireOrganization, async (req, res) => {
  try {
    const { orgId } = req.auth;
    const { group } = req.query; // Allow filtering by group
    
    const query = { organizationId: orgId };
    if (group) {
      query.group = group;
    }
    
    const services = await Service.find(query);
    res.json({ services });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new service
router.post('/', requireOrganization, async (req, res) => {
  try {
    const { name, description, group } = req.body;
    const { userId, orgId } = req.auth;
    
    const service = await Service.create({
      name,
      description,
      status: 'operational',
      group: group || 'Other', // Use provided group or default to 'Other'
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
    const { name, description, status, group } = req.body;
    const { orgId } = req.auth;
    
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (status !== undefined) updateData.status = status;
    if (group !== undefined) updateData.group = group;
    
    const service = await Service.findOneAndUpdate(
      { _id: req.params.id, organizationId: orgId },
      updateData,
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
router.delete('/:id', requireOrganization,  async (req, res) => {
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

// Get services grouped by their group
router.get('/by-group', requireOrganization, async (req, res) => {
  try {
    const { orgId } = req.auth;
    
    const services = await Service.find({ organizationId: orgId });
    
    // Group services by their group field
    const groupedServices = services.reduce((acc, service) => {
      const group = service.group || 'Other';
      if (!acc[group]) {
        acc[group] = [];
      }
      acc[group].push(service);
      return acc;
    }, {});
    
    res.json({ groupedServices });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
