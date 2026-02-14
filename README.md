# Event Management Application

A full-stack MERN (MongoDB, Express.js, React.js, Node.js) application for browsing and managing event registrations.

## Features

### Authentication
- ✅ User registration with password hashing
- ✅ User login with JWT token authentication
- ✅ Protected routes for authenticated users
- ✅ Persistent login sessions

### Event Discovery
- ✅ Browse events with pagination (load more functionality)
- ✅ Search events by name, description, or organizer
- ✅ Filter events by category, location, and date range
- ✅ View detailed event information
- ✅ Real-time seat availability tracking

### Event Registration
- ✅ Register for events with available seats
- ✅ Cancel event registrations
- ✅ Prevent duplicate registrations
- ✅ Automatic seat management

### User Dashboard
- ✅ View all registered events
- ✅ Separate upcoming and past events
- ✅ Registration summary statistics
- ✅ Quick access to event details

## Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variable management

### Frontend
- **React** - UI library
- **React Router v6** - Client-side routing
- **Axios** - HTTP client
- **CSS** - Styling (no external CSS frameworks)

## Project Structure

```
bellcorp_assignment/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── models/
│   │   ├── User.js               # User schema
│   │   ├── Event.js              # Event schema
│   │   └── Registration.js       # Registration schema
│   ├── routes/
│   │   ├── auth.js               # Authentication routes
│   │   ├── events.js             # Event routes
│   │   └── registrations.js      # Registration routes
│   ├── middleware/
│   │   └── auth.js               # JWT verification middleware
│   ├── server.js                 # Express server
│   ├── seed.js                   # Database seed script
│   ├── .env                      # Environment variables
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js         # Navigation bar
│   │   │   ├── ProtectedRoute.js # Route protection
│   │   │   ├── EventCard.js      # Event card component
│   │   │   └── SearchFilter.js   # Search and filter UI
│   │   ├── pages/
│   │   │   ├── Register.js       # User registration
│   │   │   ├── Login.js          # User login
│   │   │   ├── Events.js         # Event listing
│   │   │   ├── EventDetails.js   # Event details
│   │   │   └── Dashboard.js      # User dashboard
│   │   ├── context/
│   │   │   └── AuthContext.js    # Auth state management
│   │   ├── App.js                # Main app component
│   │   └── index.js              # Entry point
│   └── package.json
└── README.md
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
   - Open `.env` file
   - Update `MONGODB_URI` with your MongoDB connection string
   - Update `JWT_SECRET` with a secure random string

4. Seed the database with sample events:
```bash
node seed.js
```

5. Start the backend server:
```bash
npm start
```
Or for development with auto-reload:
```bash
npm run dev
```

The backend server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the React development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Events
- `GET /api/events` - Get all events (with pagination, search, filters)
- `GET /api/events/:id` - Get single event details

### Registrations (Protected)
- `POST /api/registrations` - Register for an event
- `DELETE /api/registrations/:id` - Cancel registration
- `GET /api/registrations/my-events` - Get user's registered events

## Usage Guide

### For Users

1. **Register an Account**
   - Click "Register" in the navigation bar
   - Fill in your name, email, and password
   - Click "Register" to create your account

2. **Browse Events**
   - View all available events on the home page
   - Use the search bar to find specific events
   - Apply filters by category, location, or date range
   - Click "Load More Events" to see additional events

3. **View Event Details**
   - Click on any event card to see full details
   - Check seat availability
   - Click "Register for Event" to sign up

4. **Manage Registrations**
   - Go to "Dashboard" to see your registered events
   - View upcoming and past events separately
   - Cancel registrations if needed

### For Developers

#### Adding New Events
You can add events directly to MongoDB or modify the `seed.js` file to include more sample events.

#### Customizing Categories
Update the category options in `frontend/src/components/SearchFilter.js` to add or remove event categories.

#### Modifying Pagination
Change the `limit` parameter in `frontend/src/pages/Events.js` to adjust how many events load per page.

## Code Highlights

### Beginner-Friendly Features
- ✅ Clear variable and function names
- ✅ Comprehensive comments explaining logic
- ✅ Simple, straightforward code structure
- ✅ Consistent coding patterns throughout
- ✅ No complex abstractions or over-engineering
- ✅ Easy-to-understand error handling

### Security Features
- Password hashing with bcrypt
- JWT token authentication
- Protected API routes
- Input validation
- CORS configuration

### User Experience
- Responsive design for mobile and desktop
- Loading states for better feedback
- Error messages for failed operations
- Success confirmations
- Smooth transitions and hover effects

## Future Enhancements

Potential features to add:
- Email notifications for event reminders
- Event creation by users
- Event categories management
- User profile page
- Event reviews and ratings
- Social sharing features
- Calendar integration
- Payment integration for paid events

## Troubleshooting

### Backend won't start
- Check if MongoDB is running
- Verify `.env` file has correct MongoDB URI
- Ensure port 5000 is not in use

### Frontend can't connect to backend
- Verify backend is running on port 5000
- Check for CORS errors in browser console
- Ensure API URLs in frontend match backend URL

### Database connection errors
- Verify MongoDB connection string
- Check network connectivity
- Ensure MongoDB service is running

## License

This project is created for educational purposes.

## Author

Created as part of the BellCorp Assignment.
