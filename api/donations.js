// Vercel Serverless Function for Donations with Database
import { db, validateSupabaseEnv } from './supabase.js';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (!validateSupabaseEnv(res)) return;

  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const donations = await db.getDonations();
        res.status(200).json(donations);
      } catch (error) {
        console.error('Error fetching donations:', error);
        res.status(500).json({ error: 'Failed to fetch donations' });
      }
      break;

    case 'POST':
      try {
        const donation = {
          ...req.body,
          status: 'Pending'
        };
        
        const newDonation = await db.createDonation(donation);
        res.status(201).json(newDonation);
      } catch (error) {
        console.error('Error creating donation:', error);
        res.status(500).json({ error: 'Failed to create donation' });
      }
      break;

    case 'PUT':
      try {
        const { id, ...updates } = req.body;
        const updatedDonation = await db.updateDonation(id, updates);
        res.status(200).json(updatedDonation);
      } catch (error) {
        console.error('Error updating donation:', error);
        res.status(500).json({ error: 'Failed to update donation' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
