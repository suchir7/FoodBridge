// Vercel Serverless Function for Authentication with Database
import { db, validateSupabaseEnv } from './supabase.js';
import crypto from 'crypto';

// Simple password hashing (in production, use bcrypt)
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (!validateSupabaseEnv(res)) return;

  const { method } = req;

  switch (method) {
    case 'POST':
      const { action, email, password, name, organization, role } = req.body;

      if (action === 'signin') {
        try {
          if (!email || !password) {
            return res.status(400).json({ error: 'Email and password required' });
          }

          // Check if user exists in database
          const user = await db.getUserByEmail(email);
          
          if (!user) {
            return res.status(404).json({ error: 'Account not found' });
          }

          // Verify password
          const hashedPassword = hashPassword(password);
          if (user.password_hash !== hashedPassword) {
            return res.status(401).json({ error: 'Invalid password' });
          }

          // Remove password from response
          const { password_hash, ...userWithoutPassword } = user;
          
          res.status(200).json({ 
            success: true, 
            user: userWithoutPassword,
            message: 'Sign in successful' 
          });
        } catch (error) {
          console.error('Sign in error:', error);
          res.status(500).json({ error: 'Failed to sign in' });
        }
      } 
      else if (action === 'signup') {
        try {
          if (!email || !password) {
            return res.status(400).json({ error: 'Email and password required' });
          }

          // Check if user already exists
          const existingUser = await db.getUserByEmail(email);
          if (existingUser) {
            return res.status(400).json({ error: 'Account already exists' });
          }

          // Create new user
          const user = {
            email,
            password_hash: hashPassword(password),
            name: name || email.split('@')[0],
            organization: organization || 'Individual',
            role: role || 'donor'
          };
          
          const newUser = await db.createUser(user);
          
          // Remove password from response
          const { password_hash, ...userWithoutPassword } = newUser;
          
          res.status(201).json({ 
            success: true, 
            user: userWithoutPassword,
            message: 'Account created successfully' 
          });
        } catch (error) {
          console.error('Sign up error:', error);
          res.status(500).json({ error: 'Failed to create account' });
        }
      } 
      else {
        res.status(400).json({ error: 'Invalid action' });
      }
      break;

    default:
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
