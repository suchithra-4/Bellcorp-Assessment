const mongoose = require('mongoose');
const { MockUserModel, MockUser } = require('../config/mockDB');

// Define the User schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const MongooseUser = mongoose.model('User', userSchema);

// Export a proxy that switches between Mongoose and Mock depending on state
module.exports = new Proxy(MongooseUser, {
    get(target, prop) {
        if (process.env.USE_MOCK_DB === 'true') {
            return MockUserModel[prop];
        }
        return target[prop];
    },
    construct(target, args) {
        if (process.env.USE_MOCK_DB === 'true') {
            return MockUser(...args);
        }
        return new target(...args);
    }
});
