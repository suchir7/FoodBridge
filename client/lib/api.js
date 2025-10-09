// API client for FoodBridge backend
const API_BASE = '/api';

class FoodBridgeAPI {
  // Donations API
  async getDonations() {
    const response = await fetch(`${API_BASE}/donations`);
    if (!response.ok) throw new Error('Failed to fetch donations');
    return response.json();
  }

  async createDonation(donation) {
    const response = await fetch(`${API_BASE}/donations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(donation)
    });
    if (!response.ok) throw new Error('Failed to create donation');
    return response.json();
  }

  // Requests API
  async getRequests() {
    const response = await fetch(`${API_BASE}/requests`);
    if (!response.ok) throw new Error('Failed to fetch requests');
    return response.json();
  }

  async createRequest(request) {
    const response = await fetch(`${API_BASE}/requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request)
    });
    if (!response.ok) throw new Error('Failed to create request');
    return response.json();
  }

  async updateRequestStatus(id, status) {
    const response = await fetch(`${API_BASE}/requests`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status })
    });
    if (!response.ok) throw new Error('Failed to update request');
    return response.json();
  }

  // Auth API
  async signIn(email, password) {
    const response = await fetch(`${API_BASE}/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'signin', email, password })
    });
    if (!response.ok) throw new Error('Failed to sign in');
    return response.json();
  }

  async signUp(email, password, name, organization, role) {
    const response = await fetch(`${API_BASE}/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'signup', email, password, name, organization, role })
    });
    if (!response.ok) throw new Error('Failed to sign up');
    return response.json();
  }
}

export const api = new FoodBridgeAPI();
