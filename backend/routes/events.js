const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

// GET /api/events - Get all events with pagination, search, and filters
router.get('/', async (req, res) => {
    try {
        // Get query parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || '';
        const category = req.query.category || '';
        const location = req.query.location || '';
        const startDate = req.query.startDate || '';
        const endDate = req.query.endDate || '';

        // Calculate skip value for pagination
        const skip = (page - 1) * limit;

        // Build query object
        let query = {};

        // Add search filter (searches in name, description, and organizer)
        if (search) {
            query.$text = { $search: search };
        }

        // Add category filter
        if (category) {
            query.category = category;
        }

        // Add location filter
        if (location) {
            query.location = { $regex: location, $options: 'i' }; // Case-insensitive search
        }

        // Add date range filter
        if (startDate || endDate) {
            query.date = {};
            if (startDate) {
                query.date.$gte = new Date(startDate);
            }
            if (endDate) {
                query.date.$lte = new Date(endDate);
            }
        }

        // Get total count for pagination
        const totalEvents = await Event.countDocuments(query);

        // Get events with pagination
        const events = await Event.find(query)
            .sort({ date: 1 }) // Sort by date ascending
            .skip(skip)
            .limit(limit);

        // Calculate total pages
        const totalPages = Math.ceil(totalEvents / limit);

        // Send response
        res.json({
            events,
            currentPage: page,
            totalPages,
            totalEvents,
            hasMore: page < totalPages
        });
    } catch (error) {
        console.error('Get events error:', error);
        res.status(500).json({ message: 'Server error while fetching events' });
    }
});

// GET /api/events/:id - Get single event details
router.get('/:id', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.json({ event });
    } catch (error) {
        console.error('Get event error:', error);
        res.status(500).json({ message: 'Server error while fetching event' });
    }
});

module.exports = router;
