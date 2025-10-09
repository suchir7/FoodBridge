-- Supabase database setup for FoodBridge
-- Run these commands in your Supabase SQL editor

-- Create donations table
CREATE TABLE donations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  donor_name TEXT,
  donor_email TEXT,
  details JSONB NOT NULL,
  location JSONB NOT NULL,
  status TEXT DEFAULT 'Pending',
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create requests table
CREATE TABLE requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  requester_email TEXT NOT NULL,
  org_name TEXT,
  contact TEXT,
  details JSONB NOT NULL,
  location JSONB NOT NULL,
  status TEXT DEFAULT 'Pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create users table
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT,
  organization TEXT,
  role TEXT DEFAULT 'donor',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create contacts table (for contact form submissions)
CREATE TABLE contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'contact',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create support table (for support requests)
CREATE TABLE support (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  topic TEXT,
  urgency TEXT DEFAULT 'normal',
  message TEXT NOT NULL,
  status TEXT DEFAULT 'open',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE support ENABLE ROW LEVEL SECURITY;

-- Create policies (allow public read/write for demo purposes)
-- In production, you'd want more restrictive policies

-- Donations policies
CREATE POLICY "Allow public read access on donations" ON donations
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert on donations" ON donations
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update on donations" ON donations
  FOR UPDATE USING (true);

-- Requests policies
CREATE POLICY "Allow public read access on requests" ON requests
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert on requests" ON requests
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update on requests" ON requests
  FOR UPDATE USING (true);

-- Users policies
CREATE POLICY "Allow public insert on users" ON users
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read on users" ON users
  FOR SELECT USING (true);

-- Contacts policies
CREATE POLICY "Allow public insert on contacts" ON contacts
  FOR INSERT WITH CHECK (true);

-- Support policies
CREATE POLICY "Allow public insert on support" ON support
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read on support" ON support
  FOR SELECT USING (true);

-- Create indexes for better performance
CREATE INDEX idx_donations_status ON donations(status);
CREATE INDEX idx_donations_created_at ON donations(created_at);
CREATE INDEX idx_requests_status ON requests(status);
CREATE INDEX idx_requests_created_at ON requests(created_at);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_contacts_created_at ON contacts(created_at);
CREATE INDEX idx_support_status ON support(status);
