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
    // Seed initial data if the database is empty
    const Event = require('./models/Event');
    try {
        const count = await Event.countDocuments();
        if (count === 0) {
            console.log(' Seeding database with initial events...');
            // Import sample events from seed.js or define a few here
            const sampleEvents = [
                {
                    name: 'Tech Conference 2026',
                    organizer: 'Tech Community',
                    location: 'San Francisco, CA',
                    date: new Date('2026-03-15T09:00:00'),
                    description: 'Learn about the latest trends in AI, cloud computing, and web development.',
                    capacity: 200,
                    availableSeats: 200,
                    category: 'Technology',
                    tags: ['AI', 'Cloud', 'Web']
                },
                {
                    name: 'Business Leadership Summit',
                    organizer: 'Business Leaders Association',
                    location: 'New York, NY',
                    date: new Date('2026-04-20T10:00:00'),
                    description: 'Strategic growth and innovation for business leaders.',
                    capacity: 150,
                    availableSeats: 150,
                    category: 'Business',
                    tags: ['Leadership', 'Strategy']
                },
                {
                    name: 'Health & Wellness Expo',
                    organizer: 'Wellness Institute',
                    location: 'Seattle, WA',
                    date: new Date('2026-03-30T10:00:00'),
                    description: 'Latest in health, nutrition, and wellness.',
                    capacity: 250,
                    availableSeats: 250,
                    category: 'Health',
                    tags: ['Wellness', 'Nutrition']
                }
            ];
            await Event.create(sampleEvents);
            console.log('✅ Database seeded!');
        }
    } catch (err) {
        console.error(' Error checking/seeding database:', err.message);
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
