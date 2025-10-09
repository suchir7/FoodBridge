// Database utilities for FoodBridge
// This example uses a simple JSON file, but you can replace with any database

import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const DONATIONS_FILE = path.join(DATA_DIR, 'donations.json');
const REQUESTS_FILE = path.join(DATA_DIR, 'requests.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Helper functions
function readJSON(filePath, defaultValue = []) {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
  }
  return defaultValue;
}

function writeJSON(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error);
    return false;
  }
}

// Database operations
export const db = {
  // Donations
  getDonations() {
    return readJSON(DONATIONS_FILE);
  },

  saveDonation(donation) {
    const donations = this.getDonations();
    donations.push(donation);
    return writeJSON(DONATIONS_FILE, donations);
  },

  updateDonation(id, updates) {
    const donations = this.getDonations();
    const index = donations.findIndex(d => d.id === id);
    if (index !== -1) {
      donations[index] = { ...donations[index], ...updates };
      return writeJSON(DONATIONS_FILE, donations);
    }
    return false;
  },

  // Requests
  getRequests() {
    return readJSON(REQUESTS_FILE);
  },

  saveRequest(request) {
    const requests = this.getRequests();
    requests.push(request);
    return writeJSON(REQUESTS_FILE, requests);
  },

  updateRequest(id, updates) {
    const requests = this.getRequests();
    const index = requests.findIndex(r => r.id === id);
    if (index !== -1) {
      requests[index] = { ...requests[index], ...updates };
      return writeJSON(REQUESTS_FILE, requests);
    }
    return false;
  },

  // Users
  getUsers() {
    return readJSON(USERS_FILE);
  },

  saveUser(user) {
    const users = this.getUsers();
    users.push(user);
    return writeJSON(USERS_FILE, users);
  },

  findUserByEmail(email) {
    const users = this.getUsers();
    return users.find(u => u.email === email);
  }
};
