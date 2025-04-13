import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { clerkMiddleware, requireAuth } from '@clerk/express';
import serviceRoutes from './routes/serviceRoutes.js';
import incidentRoutes from './routes/incidentRoutes.js';
import maintenanceRoutes from './routes/maintenanceRoutes.js';
import websiteRoutes from './routes/websiteRoutes.js'; // Add website routes
import errorHandler from './middleware/errorHandler.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
    maxPoolSize: 10,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

const app = express();

// Updated CORS configuration
app.use(cors({
  origin: '*', // Allow requests from any origin
  methods: '*', // Allow all HTTP methods
  credentials: true // Disable credentials for open access
}));

app.use(express.json());
app.use(clerkMiddleware());

// Routes
app.get('/api/public', (req, res) => {
  res.json({ message: 'This is a public endpoint' });
});

// Protected route with Clerk authentication
app.get('/api/protected', 
  requireAuth(),
  (req, res) => {
    res.json({ 
      message: 'This is a protected endpoint',
      userId: req.auth.userId,
      orgId: req.auth.orgId
    });
  }
);

// Mount route handlers
app.use('/api/services', serviceRoutes);
app.use('/api/incidents', incidentRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/v1/website', websiteRoutes); // Mount website routes

// Additional route for CORS testing
app.get('/api/services', (req, res) => {
  res.json({ message: 'CORS is now enabled!' });
});

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
