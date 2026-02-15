const mongoose = require('mongoose');
const { MockRegistrationModel, MockRegistration } = require('../config/mockDB');

const registrationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    registeredAt: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['active', 'cancelled'],
        default: 'active'
    }
});

registrationSchema.index({ userId: 1, eventId: 1 }, { unique: true });

const MongooseRegistration = mongoose.model('Registration', registrationSchema);

module.exports = new Proxy(MongooseRegistration, {
    get(target, prop) {
        if (process.env.USE_MOCK_DB === 'true') {
            return MockRegistrationModel[prop];
        }
        return target[prop];
    },
    construct(target, args) {
        if (process.env.USE_MOCK_DB === 'true') {
            return MockRegistration(...args);
        }
        return new target(...args);
    }
});
