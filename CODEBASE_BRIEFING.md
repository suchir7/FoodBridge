# FoodBridge Codebase Briefing

## 1. Project Overview
FoodBridge is a full-stack web application designed to connect food donors (restaurants, individuals) with recipients (NGOs, charities) to reduce food waste and help those in need. The application features user authentication, role-based dashboards (Donor, Recipient, Admin, Analyst), real-time donation listings, and impact tracking.

## 2. Tech Stack

### Frontend
- **Framework**: React (Vite)
- **Language**: JavaScript
- **Styling**: Tailwind CSS, Shadcn UI (Radix UI primitives)
- **Routing**: React Router DOM
- **State Management**: React Query (TanStack Query), React Context (Auth)
- **Maps**: Leaflet (React Leaflet)
- **Charts**: Recharts
- **Animations**: Framer Motion, Three.js (React Three Fiber)

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth

## 3. Directory Structure

- **`client/`**: Contains the React frontend application.
  - **`pages/`**: Application views/routes.
  - **`components/`**: Reusable UI components.
    - **`ui/`**: Generic UI components (buttons, inputs, etc.).
    - **`foodbridge/`**: Custom business-logic components.
    - **`site/`**: Layout components (Header, Footer).
  - **`hooks/`**: Custom React hooks.
  - **`lib/`**: Utility functions and configurations.
  - **`state/`**: Global state management (Auth).

- **`server/`**: Contains the Express backend server.
  - **`routes/`**: API route definitions.
  - **`index.js`**: Server entry point.

- **`api/`**: Core backend logic and database interaction modules (likely used by the server or as serverless functions).

## 4. Feature Breakdown & File Mapping

### Authentication
- **Feature**: User Sign In and Sign Up.
- **Frontend Pages**: 
  - `client/pages/auth/SignIn.jsx`
  - `client/pages/auth/SignUp.jsx`
- **State**: `client/state/auth.jsx` (AuthProvider)
- **Backend Routes**: `server/routes/auth.js`
- **Logic**: `api/auth.js`

### Dashboards (Role-Based)
- **Admin Dashboard**: `client/pages/dashboards/Admin.jsx` - System oversight.
- **Donor Dashboard**: `client/pages/dashboards/Donor.jsx` - Track past donations.
- **Recipient Dashboard**: `client/pages/dashboards/Recipient.jsx` - Find food and track requests.
- **Analyst Dashboard**: `client/pages/dashboards/Analyst.jsx` - Data visualization and impact analysis.

### Donation Flow
- **Feature**: Donors listing food items.
- **Frontend Page**: `client/pages/donate/Wizard.jsx` (Multi-step form).
- **Backend Routes**: `server/routes/donations.js`
- **Logic**: `api/donations.js`

### Request Flow
- **Feature**: Recipients requesting specific needs.
- **Frontend Page**: `client/pages/request/RequestForm.jsx`
- **Backend Routes**: `server/routes/requests.js`
- **Logic**: `api/requests.js`

### Donation Listings
- **Feature**: Browsing available food donations.
- **Frontend Page**: `client/pages/donations/Listings.jsx`

### Impact & Landing
- **Landing Page**: `client/pages/Index.jsx`
  - Uses: `client/components/foodbridge/Hero.jsx`, `HowItWorks.jsx`, `StatsStrip.jsx`
- **Impact Page**: `client/pages/Impact.jsx`
  - Uses: `client/components/foodbridge/ImpactStories.jsx`, `IndiaMap.jsx`

## 5. Key Components (`client/components/foodbridge`)

- **`Hero.jsx`**: The main visual entry point on the landing page.
- **`HowItWorks.jsx`**: Explains the donation/collection process.
- **`StatsStrip.jsx`**: Displays key metrics (meals served, CO2 saved).
- **`ImpactStories.jsx`**: Carousel of success stories.
- **`IndiaMap.jsx`**: Interactive map visualizing reach or activity.
- **`MapPicker.jsx`**: Component for selecting locations on a map (used in forms).
- **`AnimatedCounter.jsx`**: Utility for animating number statistics.

## 6. Backend Logic (`api/`)

- **`auth.js`**: Handles user registration, login, and session management via Supabase.
- **`donations.js`**: CRUD operations for donation items.
- **`requests.js`**: CRUD operations for food requests.
- **`supabase.js`**: Supabase client initialization and configuration.
- **`db.js`**: Database connection helpers.

## 7. Configuration Files

- **`vite.config.js`**: Vite build configuration.
- **`tailwind.config.js`**: Tailwind CSS theme and plugin configuration.
- **`supabase-setup.sql`**: SQL script for setting up the database schema.
- **`package.json`**: Project dependencies and scripts.
