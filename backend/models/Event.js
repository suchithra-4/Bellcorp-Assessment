const mongoose = require('mongoose');
const { MockEventModel, MockEvent } = require('../config/mockDB');

const eventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Event name is required'],
        trim: true
    },
    organizer: {
        type: String,
        required: [true, 'Organizer name is required'],
        trim: true
    },
    location: {
        type: String,
        required: [true, 'Location is required'],
        trim: true
    },
    date: {
        type: Date,
        required: [true, 'Event date is required']
    },
    description: {
        type: String,
        required: [true, 'Description is required']
    },
    capacity: {
        type: Number,
        required: [true, 'Capacity is required'],
        min: [1, 'Capacity must be at least 1']
    },
    availableSeats: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        trim: true
    },
    tags: [{
        type: String,
        trim: true
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

eventSchema.index({ name: 'text', description: 'text', organizer: 'text' });

const MongooseEvent = mongoose.model('Event', eventSchema);

module.exports = new Proxy(MongooseEvent, {
    get(target, prop) {
        if (process.env.USE_MOCK_DB === 'true') {
            return MockEventModel[prop];
        }
        return target[prop];
    },
    construct(target, args) {
        if (process.env.USE_MOCK_DB === 'true') {
            return MockEvent(...args);
        }
        return new target(...args);
    }
});
