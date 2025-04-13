import { clerkClient } from '@clerk/express';

export const requireOrganization = async (req, res, next) => {
  try {
    // clerkMiddleware has already verified authentication
    // and attached req.auth
    
    const { userId, orgId } = req.auth;
    
    if (!orgId) {
      return res.status(403).json({ 
        error: 'Organization required',
        message: 'You must select an organization to access this resource'
      });
    }
    
    // You can fetch additional organization data if needed
    const organization = await clerkClient.organizations.getOrganization({ 
      organizationId: orgId 
    });
    
    // Attach organization data to the request
    req.organization = organization;
    
    next();
  } catch (error) {
    console.error('Organization middleware error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const requireAdmin = async (req, res, next) => {
  try {
    const { userId, orgId, orgRole } = req.auth;
    
    if (!orgId) {
      return res.status(403).json({ 
        error: 'Organization required',
        message: 'You must select an organization to access this resource'
      });
    }
    
    if (orgRole !== 'admin') {
      return res.status(403).json({ 
        error: 'Insufficient permissions',
        message: 'Admin role required'
      });
    }
    
    next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
