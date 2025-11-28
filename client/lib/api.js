// API client for FoodBridge (LocalStorage Implementation)

const DELAY = 500; // Simulate network delay

const KEYS = {
  USERS: 'fb_users',
  DONATIONS: 'fb_donations',
  REQUESTS: 'fb_requests'
};

// Helper to simulate async API call
const mockAsync = (callback) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        resolve(callback());
      } catch (e) {
        reject(e);
      }
    }, DELAY);
  });
};

class FoodBridgeAPI {
  constructor() {
    // Initialize storage if empty
    if (!localStorage.getItem(KEYS.USERS)) localStorage.setItem(KEYS.USERS, '[]');
    if (!localStorage.getItem(KEYS.DONATIONS)) localStorage.setItem(KEYS.DONATIONS, '[]');
    if (!localStorage.getItem(KEYS.REQUESTS)) localStorage.setItem(KEYS.REQUESTS, '[]');
  }

  // --- Donations ---

  async getDonations() {
    return mockAsync(() => {
      return JSON.parse(localStorage.getItem(KEYS.DONATIONS) || '[]');
    });
  }

  async createDonation(donation) {
    return mockAsync(() => {
      const list = JSON.parse(localStorage.getItem(KEYS.DONATIONS) || '[]');
      const newDonation = {
        ...donation,
        id: crypto.randomUUID(),
        status: 'Pending',
        created_at: new Date().toISOString(),
        // Map frontend camelCase to what the UI expects (or keep consistent)
        // The UI expects snake_case for some fields because we were using Supabase.
        // Let's adapt the input to match the expected output schema.
        donor_name: donation.donorName,
        donor_email: donation.donorEmail,
        image_url: donation.image,
        details: donation.details,
        location: donation.location
      };
      list.unshift(newDonation);
      localStorage.setItem(KEYS.DONATIONS, JSON.stringify(list));
      return newDonation;
    });
  }

  async updateDonationStatus(id, status) {
    return mockAsync(() => {
      const list = JSON.parse(localStorage.getItem(KEYS.DONATIONS) || '[]');
      const index = list.findIndex(d => d.id === id);
      if (index === -1) throw new Error('Donation not found');

      list[index].status = status;
      localStorage.setItem(KEYS.DONATIONS, JSON.stringify(list));
      return list[index];
    });
  }

  // --- Requests ---

  async getRequests() {
    return mockAsync(() => {
      return JSON.parse(localStorage.getItem(KEYS.REQUESTS) || '[]');
    });
  }

  async createRequest(request) {
    return mockAsync(() => {
      const list = JSON.parse(localStorage.getItem(KEYS.REQUESTS) || '[]');
      const newRequest = {
        ...request,
        id: crypto.randomUUID(),
        status: 'Pending',
        created_at: new Date().toISOString(),
        requester_email: request.requesterEmail,
        org_name: request.orgName,
        contact: request.contact,
        details: request.details,
        location: request.location
      };
      list.unshift(newRequest);
      localStorage.setItem(KEYS.REQUESTS, JSON.stringify(list));
      return newRequest;
    });
  }

  async updateRequestStatus(id, status) {
    return mockAsync(() => {
      const list = JSON.parse(localStorage.getItem(KEYS.REQUESTS) || '[]');
      const index = list.findIndex(r => r.id === id);
      if (index === -1) throw new Error('Request not found');

      list[index].status = status;
      localStorage.setItem(KEYS.REQUESTS, JSON.stringify(list));
      return list[index];
    });
  }

  // --- Auth ---

  async signIn(email, password) {
    return mockAsync(() => {
      const users = JSON.parse(localStorage.getItem(KEYS.USERS) || '[]');
      const user = users.find(u => u.email === email && u.password === password);
      if (!user) throw new Error('Invalid credentials');
      const { password: _, ...safeUser } = user;
      return safeUser;
    });
  }

  async signUp(email, password, name, organization, role) {
    return mockAsync(() => {
      const users = JSON.parse(localStorage.getItem(KEYS.USERS) || '[]');
      if (users.find(u => u.email === email)) throw new Error('User already exists');

      const newUser = {
        id: crypto.randomUUID(),
        email,
        password, // In a real app, never store plain text passwords!
        name,
        organization,
        role,
        created_at: new Date().toISOString()
      };

      users.push(newUser);
      localStorage.setItem(KEYS.USERS, JSON.stringify(users));

      const { password: _, ...safeUser } = newUser;
      return safeUser;
    });
  }
}

export const api = new FoodBridgeAPI();
