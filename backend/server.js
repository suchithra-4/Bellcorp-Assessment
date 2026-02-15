// Load environment variables first
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');
const registrationRoutes = require('./routes/registrations');

// Create Express app
const app = express();

// Connect to MongoDB
connectDB().then(async () => {
    // Seed initial data if using mock DB and it's empty
    if (process.env.USE_MOCK_DB === 'true') {
        const Event = require('./models/Event');
        const count = await Event.countDocuments();
        if (count === 0) {
            console.log(' Seeding mock database with initial events...');
            const sampleEvents = [
                {
                    name: 'Tech Conference 2026',
                    organizer: 'Tech Solutions',
                    location: 'Online',
                    date: new Date('2026-05-15'),
                    description: 'A deep dive into the latest technologies including AI, Cloud, and Web Development.',
                    capacity: 500,
                    availableSeats: 500,
                    category: 'Technology',
                    tags: ['AI', 'Tech', 'Web']
                },
                {
                    name: 'Design Workshop',
                    organizer: 'Creative Arts',
                    location: 'New York, NY',
                    date: new Date('2026-06-10'),
                    description: 'Learn modern UI/UX design principles and tools in this hands-on workshop.',
                    capacity: 50,
                    availableSeats: 50,
                    category: 'Design',
                    tags: ['Design', 'UI/UX']
                }
            ];
            await Event.create(sampleEvents);
        }
    }
});

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON request bodies

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/registrations', registrationRoutes);

// Root route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Event Management API' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(` Server is running on port ${PORT}`);
});
