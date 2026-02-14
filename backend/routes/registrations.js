const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Registration = require('../models/Registration');
const Event = require('../models/Event');

// POST /api/registrations - Register for an event (Protected route)
router.post('/', auth, async (req, res) => {
    try {
        const { eventId } = req.body;
        const userId = req.userId; // From auth middleware

        // Validate input
        if (!eventId) {
            return res.status(400).json({ message: 'Event ID is required' });
        }

        // Check if event exists
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Check if seats are available
        if (event.availableSeats <= 0) {
            return res.status(400).json({ message: 'No seats available for this event' });
        }

        // Check if user already registered for this event
        const existingRegistration = await Registration.findOne({
            userId,
            eventId,
            status: 'active'
        });

        if (existingRegistration) {
            return res.status(400).json({ message: 'You are already registered for this event' });
        }

        // Create new registration
        const registration = new Registration({
            userId,
            eventId
        });

        // Save registration and update available seats
        await registration.save();

        // Decrease available seats
        event.availableSeats -= 1;
        await event.save();

        // Populate registration with event details
        await registration.populate('eventId');

        res.status(201).json({
            message: 'Successfully registered for the event',
            registration
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
});

// DELETE /api/registrations/:id - Cancel registration (Protected route)
router.delete('/:id', auth, async (req, res) => {
    try {
        const registrationId = req.params.id;
        const userId = req.userId;

        // Find registration
        const registration = await Registration.findById(registrationId);

        if (!registration) {
            return res.status(404).json({ message: 'Registration not found' });
        }

        // Check if registration belongs to the user
        if (registration.userId.toString() !== userId) {
            return res.status(403).json({ message: 'Not authorized to cancel this registration' });
        }

        // Check if already cancelled
        if (registration.status === 'cancelled') {
            return res.status(400).json({ message: 'Registration already cancelled' });
        }

        // Update registration status
        registration.status = 'cancelled';
        await registration.save();

        // Increase available seats
        const event = await Event.findById(registration.eventId);
        if (event) {
            event.availableSeats += 1;
            await event.save();
        }

        res.json({ message: 'Registration cancelled successfully' });
    } catch (error) {
        console.error('Cancel registration error:', error);
        res.status(500).json({ message: 'Server error while cancelling registration' });
    }
});

// GET /api/registrations/my-events - Get user's registered events (Protected route)
router.get('/my-events', auth, async (req, res) => {
    try {
        const userId = req.userId;

        // Get all active registrations for the user
        const registrations = await Registration.find({
            userId,
            status: 'active'
        }).populate('eventId');

        // Separate upcoming and past events
        const now = new Date();
        const upcoming = [];
        const past = [];

        registrations.forEach(reg => {
            if (reg.eventId.date >= now) {
                upcoming.push(reg);
            } else {
                past.push(reg);
            }
        });

        res.json({
            upcoming,
            past,
            totalRegistrations: registrations.length
        });
    } catch (error) {
        console.error('Get my events error:', error);
        res.status(500).json({ message: 'Server error while fetching your events' });
    }
});

module.exports = router;
