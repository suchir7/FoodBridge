// Vercel Serverless Function for Food Requests
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { method } = req;

  switch (method) {
    case 'GET':
      // Get all requests
      try {
        const requests = [
          {
            id: '1',
            requesterEmail: 'shelter@community.org',
            orgName: 'Community Shelter',
            contact: 'John Smith · (555) 123-4567',
            details: {
              type: 'Cooked',
              quantity: '30 plates',
              urgency: 'today'
            },
            location: {
              address: '456 Community St',
              lat: 40.7589,
              lng: -73.9851
            },
            status: 'Pending',
            createdAt: Date.now()
          }
        ];
        res.status(200).json(requests);
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch requests' });
      }
      break;

    case 'POST':
      // Create new request
      try {
        const request = {
          id: Date.now().toString(),
          ...req.body,
          createdAt: Date.now(),
          status: 'Pending'
        };
        
        console.log('New food request:', request);
        
        res.status(201).json(request);
      } catch (error) {
        res.status(500).json({ error: 'Failed to create request' });
      }
      break;

    case 'PUT':
      // Update request status
      try {
        const { id, status } = req.body;
        
        // In a real app, update in database
        console.log(`Updating request ${id} to status: ${status}`);
        
        res.status(200).json({ id, status, updatedAt: Date.now() });
      } catch (error) {
        res.status(500).json({ error: 'Failed to update request' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
