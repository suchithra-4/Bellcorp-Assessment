# Quick Start Guide

## Prerequisites
- Node.js installed (v14 or higher)
- MongoDB installed locally OR MongoDB Atlas account

## Step 1: MongoDB Setup

### Option A: Local MongoDB
1. Install MongoDB on your system
2. Start MongoDB service
3. Use connection string: `mongodb://localhost:27017/event-management`

### Option B: MongoDB Atlas (Recommended)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster (free tier)
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Replace `<password>` with your database password

## Step 2: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies (already done)
npm install

# Update .env file with your MongoDB connection string
# Open .env and update MONGODB_URI

# Seed the database with sample events
node seed.js

# Start the backend server
npm start
```

Backend will run on: `http://localhost:5000`

## Step 3: Frontend Setup

```bash
# Open a new terminal
# Navigate to frontend directory
cd frontend

# Install dependencies (already done)
npm install

# Start the React development server
npm start
```

Frontend will run on: `http://localhost:3000`

## Step 4: Test the Application

1. **Register a new account**
   - Go to `http://localhost:3000`
   - Click "Register"
   - Fill in your details
   - Click "Register"

2. **Browse events**
   - You'll be redirected to the events page
   - See 15 sample events
   - Try searching for events
   - Apply filters (category, location, date)

3. **Register for an event**
   - Click on any event card
   - Click "Register for Event"
   - Check the dashboard to see your registration

4. **View dashboard**
   - Click "Dashboard" in the navigation
   - See your registered events
   - Try cancelling a registration

## Troubleshooting

### Backend won't start
- Make sure MongoDB is running
- Check if port 5000 is available
- Verify `.env` file has correct MongoDB URI

### Frontend can't connect to backend
- Ensure backend is running on port 5000
- Check browser console for errors
- Verify CORS is enabled in backend

### Database connection error
- Check MongoDB connection string
- Ensure MongoDB service is running
- Verify network connectivity (for Atlas)

## Default Configuration

- **Backend Port**: 5000
- **Frontend Port**: 3000
- **Database Name**: event-management
- **JWT Expiration**: 7 days
- **Events per page**: 10

## Sample Events

The seed script creates 15 events across 6 categories:
- Technology (3 events)
- Business (3 events)
- Arts (3 events)
- Sports (2 events)
- Education (2 events)
- Health (2 events)

All events are scheduled for dates in 2026.

## Next Steps

After testing locally:
1. Deploy backend to Heroku/Railway/Render
2. Deploy frontend to Vercel/Netlify
3. Update frontend API URLs to production backend
4. Set up MongoDB Atlas for production database

Enjoy your Event Management Application! 🎉
