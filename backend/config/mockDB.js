const Datastore = require('nedb-promises');
const path = require('path');

// Initialize datastores (in-memory for Render, but could be files)
// Using files in /tmp for short-term persistence on Render if needed
const useFiles = process.env.NODE_ENV === 'production';
const dbPath = (filename) => useFiles ? path.join('/tmp', filename) : null;

const db = {
    users: Datastore.create({ filename: dbPath('users.db'), autoload: true }),
    events: Datastore.create({ filename: dbPath('events.db'), autoload: true }),
    registrations: Datastore.create({ filename: dbPath('registrations.db'), autoload: true })
};

// Simple Mock Model wrapper to mimic Mongoose
class MockModel {
    constructor(collectionName) {
        this.collection = db[collectionName];
    }

    async find(query = {}) {
        return await this.collection.find(query);
    }

    async findOne(query) {
        return await this.collection.findOne(query);
    }

    async findById(id) {
        return await this.collection.findOne({ _id: id });
    }

    async create(data) {
        // Handle both single object and array
        if (Array.isArray(data)) {
            return await this.collection.insertMany(data);
        }
        return await this.collection.insert(data);
    }

    // Support new Model(data).save()
    wrap(data) {
        const self = this;
        const obj = { ...data };
        obj.save = async function () {
            if (this._id) {
                await self.collection.update({ _id: this._id }, this);
                return this;
            } else {
                const doc = await self.collection.insert(this);
                Object.assign(this, doc);
                return this;
            }
        };
        return obj;
    }

    // For static calls like User.countDocuments()
    async countDocuments(query) {
        return await this.collection.count(query);
    }

    async deleteOne(query) {
        return await this.collection.remove(query);
    }

    async findByIdAndDelete(id) {
        return await this.collection.remove({ _id: id });
    }

    async updateOne(query, update) {
        return await this.collection.update(query, { $set: update });
    }
}

const MockUser = new MockModel('users');
const MockEvent = new MockModel('events');
const MockRegistration = new MockModel('registrations');

module.exports = {
    MockUser: (data) => MockUser.wrap(data),
    MockUserModel: MockUser,
    MockEvent: (data) => MockEvent.wrap(data),
    MockEventModel: MockEvent,
    MockRegistration: (data) => MockRegistration.wrap(data),
    MockRegistrationModel: MockRegistration,
    isMock: true
};
