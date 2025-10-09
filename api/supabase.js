// Supabase database integration for FoodBridge
import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL || 'your-supabase-url';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'your-supabase-anon-key';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Database operations
export const db = {
  // Donations
  async getDonations() {
    const { data, error } = await supabase
      .from('donations')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async createDonation(donation) {
    const { data, error } = await supabase
      .from('donations')
      .insert([donation])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateDonation(id, updates) {
    const { data, error } = await supabase
      .from('donations')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Requests
  async getRequests() {
    const { data, error } = await supabase
      .from('requests')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async createRequest(request) {
    const { data, error } = await supabase
      .from('requests')
      .insert([request])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateRequest(id, updates) {
    const { data, error } = await supabase
      .from('requests')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Users
  async createUser(user) {
    const { data, error } = await supabase
      .from('users')
      .insert([user])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getUserByEmail(email) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }
};
