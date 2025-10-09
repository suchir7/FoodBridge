# FoodBridge Setup Guide

## 🚀 Quick Start (Current Setup)
The app currently works with localStorage for demo purposes. All data is stored locally in your browser.

## 🌐 Cross-Device Data Persistence

To get data that syncs across all devices and browsers, you need to set up a database.

### Option 1: Supabase (Recommended - Free)

1. **Create Supabase Account**
   - Go to [supabase.com](https://supabase.com)
   - Sign up for free
   - Create a new project

2. **Set Up Database**
   - Go to SQL Editor in your Supabase dashboard
   - Copy and paste the contents of `supabase-setup.sql`
   - Run the SQL commands to create tables

3. **Get API Keys**
   - Go to Settings → API
   - Copy your Project URL and anon public key

4. **Add Environment Variables**
   - Create `.env.local` file in your project root:
   ```env
   SUPABASE_URL=your-project-url
   SUPABASE_ANON_KEY=your-anon-key
   ```

5. **Install Dependencies**
   ```bash
   npm install @supabase/supabase-js
   ```

6. **Deploy to Vercel**
   - Push your code to GitHub
   - Connect to Vercel
   - Add the environment variables in Vercel dashboard
   - Deploy!

### Option 2: Use Without Database (Current)
- Data stays in your browser only
- Perfect for demos and testing
- No setup required

## 🗺️ Address Autocomplete Features

The app now includes:
- ✅ **Real-time address suggestions** using OpenStreetMap
- ✅ **Automatic coordinate detection** when you select an address
- ✅ **Map integration** - addresses update the map pin
- ✅ **Free and open-source** - no API keys needed

## 🔧 Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 📱 Features

- **Student Initiative Branding** - About and Contact pages reflect university student development
- **Food Request System** - Submit and track food requests
- **Donation Management** - Create and manage food donations
- **Interactive Maps** - Visual location selection with autocomplete
- **Responsive Design** - Works on all devices
- **Real-time Updates** - Live data synchronization

## 🎯 For Your Student Project

This setup is perfect for:
- **University presentations**
- **Portfolio demonstrations**
- **Learning full-stack development**
- **Real-world impact projects**

The app demonstrates modern web development practices while solving a real community problem!
