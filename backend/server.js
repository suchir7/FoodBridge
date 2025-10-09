// Full Express backend for FoodBridge
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { db } from './database.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Donations routes
app.get('/api/donations', async (req, res) => {
  try {
    const donations = await db.getDonations();
    res.json(donations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch donations' });
  }
});

app.post('/api/donations', async (req, res) => {
  try {
    const donation = {
      id: Date.now().toString(),
      ...req.body,
      createdAt: Date.now(),
      status: 'Pending'
    };
    
    await db.saveDonation(donation);
    res.status(201).json(donation);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create donation' });
  }
});

// Requests routes
app.get('/api/requests', async (req, res) => {
  try {
    const requests = await db.getRequests();
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch requests' });
  }
});

app.post('/api/requests', async (req, res) => {
  try {
    const request = {
      id: Date.now().toString(),
      ...req.body,
      createdAt: Date.now(),
      status: 'Pending'
    };
    
    await db.saveRequest(request);
    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create request' });
  }
});

app.put('/api/requests/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const success = await db.updateRequest(id, updates);
    if (success) {
      res.json({ id, ...updates, updatedAt: Date.now() });
    } else {
      res.status(404).json({ error: 'Request not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update request' });
  }
});

// Auth routes
app.post('/api/auth/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await db.findUserByEmail(email);
    if (user && user.password === password) {
      const { password: _, ...userWithoutPassword } = user;
      res.json({ success: true, user: userWithoutPassword });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to sign in' });
  }
});

app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password, name, organization, role } = req.body;
    
    const existingUser = await db.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    const user = {
      id: Date.now().toString(),
      email,
      password, // In production, hash this!
      name: name || email.split('@')[0],
      organization: organization || 'Individual',
      role: role || 'donor',
      createdAt: Date.now()
    };
    
    await db.saveUser(user);
    const { password: _, ...userWithoutPassword } = user;
    res.status(201).json({ success: true, user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 FoodBridge backend running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});

export default app;
