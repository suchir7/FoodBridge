// Vercel Serverless Function for Authentication
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { method } = req;

  switch (method) {
    case 'POST':
      const { action, email, password, name, organization, role } = req.body;

      if (action === 'signin') {
        // Simple authentication (in production, use proper auth)
        if (email && password) {
          const user = {
            id: Date.now().toString(),
            email,
            name: name || email.split('@')[0],
            organization: organization || 'Individual',
            role: role || 'donor',
            createdAt: Date.now()
          };
          
          res.status(200).json({ 
            success: true, 
            user,
            message: 'Sign in successful' 
          });
        } else {
          res.status(400).json({ error: 'Email and password required' });
        }
      } 
      else if (action === 'signup') {
        // Simple registration
        if (email && password) {
          const user = {
            id: Date.now().toString(),
            email,
            name: name || email.split('@')[0],
            organization: organization || 'Individual',
            role: role || 'donor',
            createdAt: Date.now()
          };
          
          res.status(201).json({ 
            success: true, 
            user,
            message: 'Account created successfully' 
          });
        } else {
          res.status(400).json({ error: 'Email and password required' });
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
