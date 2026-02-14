// Seed script to populate database with sample events
require('dotenv').config();
const mongoose = require('mongoose');
const Event = require('./models/Event');

// Sample events data
const sampleEvents = [
    {
        name: 'Tech Conference 2026',
        organizer: 'Tech Community',
        location: 'San Francisco, CA',
        date: new Date('2026-03-15T09:00:00'),
        description: 'Join us for the biggest tech conference of the year! Learn about the latest trends in AI, cloud computing, and web development. Network with industry leaders and attend hands-on workshops.',
        capacity: 200,
        availableSeats: 200,
        category: 'Technology',
        tags: ['AI', 'Cloud', 'Networking']
    },
    {
        name: 'Business Leadership Summit',
        organizer: 'Business Leaders Association',
        location: 'New York, NY',
        date: new Date('2026-04-20T10:00:00'),
        description: 'A premier event for business leaders and entrepreneurs. Discover strategies for growth, innovation, and leadership excellence.',
        capacity: 150,
        availableSeats: 150,
        category: 'Business',
        tags: ['Leadership', 'Strategy', 'Innovation']
    },
    {
        name: 'Art Exhibition: Modern Perspectives',
        organizer: 'City Art Gallery',
        location: 'Los Angeles, CA',
        date: new Date('2026-03-25T14:00:00'),
        description: 'Experience contemporary art from emerging and established artists. This exhibition showcases diverse perspectives on modern life.',
        capacity: 100,
        availableSeats: 100,
        category: 'Arts',
        tags: ['Exhibition', 'Contemporary', 'Visual Arts']
    },
    {
        name: 'Marathon for Health',
        organizer: 'City Sports Club',
        location: 'Chicago, IL',
        date: new Date('2026-05-10T07:00:00'),
        description: 'Annual city marathon promoting health and fitness. All skill levels welcome! Includes 5K, 10K, and full marathon options.',
        capacity: 500,
        availableSeats: 500,
        category: 'Sports',
        tags: ['Running', 'Fitness', 'Community']
    },
    {
        name: 'Education Innovation Forum',
        organizer: 'Education Foundation',
        location: 'Boston, MA',
        date: new Date('2026-04-05T09:00:00'),
        description: 'Explore the future of education with innovative teaching methods, technology integration, and student engagement strategies.',
        capacity: 180,
        availableSeats: 180,
        category: 'Education',
        tags: ['Innovation', 'Teaching', 'Technology']
    },
    {
        name: 'Health & Wellness Expo',
        organizer: 'Wellness Institute',
        location: 'Seattle, WA',
        date: new Date('2026-03-30T10:00:00'),
        description: 'Discover the latest in health, nutrition, and wellness. Free health screenings, expert talks, and wellness product demonstrations.',
        capacity: 250,
        availableSeats: 250,
        category: 'Health',
        tags: ['Wellness', 'Nutrition', 'Fitness']
    },
    {
        name: 'Startup Pitch Competition',
        organizer: 'Venture Capital Network',
        location: 'Austin, TX',
        date: new Date('2026-04-15T13:00:00'),
        description: 'Watch innovative startups pitch their ideas to top investors. Network with entrepreneurs and learn about the startup ecosystem.',
        capacity: 120,
        availableSeats: 120,
        category: 'Business',
        tags: ['Startups', 'Investment', 'Entrepreneurship']
    },
    {
        name: 'Music Festival 2026',
        organizer: 'Music Lovers Society',
        location: 'Nashville, TN',
        date: new Date('2026-06-01T16:00:00'),
        description: 'Three days of amazing music featuring local and international artists across multiple genres. Food, drinks, and great vibes!',
        capacity: 1000,
        availableSeats: 1000,
        category: 'Arts',
        tags: ['Music', 'Festival', 'Entertainment']
    },
    {
        name: 'Coding Bootcamp Workshop',
        organizer: 'Code Academy',
        location: 'Denver, CO',
        date: new Date('2026-03-22T09:00:00'),
        description: 'Intensive one-day workshop covering web development fundamentals. Perfect for beginners wanting to start their coding journey.',
        capacity: 50,
        availableSeats: 50,
        category: 'Technology',
        tags: ['Coding', 'Web Development', 'Workshop']
    },
    {
        name: 'Yoga & Meditation Retreat',
        organizer: 'Mindful Living Center',
        location: 'Portland, OR',
        date: new Date('2026-05-20T08:00:00'),
        description: 'Weekend retreat focused on yoga, meditation, and mindfulness. Disconnect from daily stress and reconnect with yourself.',
        capacity: 40,
        availableSeats: 40,
        category: 'Health',
        tags: ['Yoga', 'Meditation', 'Wellness']
    },
    {
        name: 'Photography Masterclass',
        organizer: 'Visual Arts Institute',
        location: 'Miami, FL',
        date: new Date('2026-04-12T10:00:00'),
        description: 'Learn advanced photography techniques from professional photographers. Covers landscape, portrait, and street photography.',
        capacity: 30,
        availableSeats: 30,
        category: 'Arts',
        tags: ['Photography', 'Workshop', 'Visual Arts']
    },
    {
        name: 'Cybersecurity Summit',
        organizer: 'Security Professionals Network',
        location: 'Washington, DC',
        date: new Date('2026-05-05T09:00:00'),
        description: 'Stay ahead of cyber threats. Learn about the latest security technologies, best practices, and threat intelligence.',
        capacity: 200,
        availableSeats: 200,
        category: 'Technology',
        tags: ['Security', 'Cybersecurity', 'IT']
    },
    {
        name: 'Basketball Tournament',
        organizer: 'City Sports League',
        location: 'Phoenix, AZ',
        date: new Date('2026-03-28T14:00:00'),
        description: 'Annual amateur basketball tournament. Teams compete for the championship trophy. Spectators welcome!',
        capacity: 300,
        availableSeats: 300,
        category: 'Sports',
        tags: ['Basketball', 'Tournament', 'Competition']
    },
    {
        name: 'Digital Marketing Conference',
        organizer: 'Marketing Professionals Association',
        location: 'Atlanta, GA',
        date: new Date('2026-04-25T09:00:00'),
        description: 'Master digital marketing strategies including SEO, social media, content marketing, and analytics.',
        capacity: 150,
        availableSeats: 150,
        category: 'Business',
        tags: ['Marketing', 'Digital', 'Strategy']
    },
    {
        name: 'Science Fair for Kids',
        organizer: 'Education Department',
        location: 'Philadelphia, PA',
        date: new Date('2026-05-15T10:00:00'),
        description: 'Interactive science fair for children. Hands-on experiments, demonstrations, and learning activities.',
        capacity: 200,
        availableSeats: 200,
        category: 'Education',
        tags: ['Science', 'Kids', 'Learning']
    }
];

// Connect to MongoDB and seed data
const seedDatabase = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing events
        await Event.deleteMany({});
        console.log('🗑️  Cleared existing events');

        // Insert sample events
        await Event.insertMany(sampleEvents);
        console.log(`✅ Successfully added ${sampleEvents.length} sample events`);

        // Close connection
        await mongoose.connection.close();
        console.log('👋 Database connection closed');
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

// Run the seed function
seedDatabase();
