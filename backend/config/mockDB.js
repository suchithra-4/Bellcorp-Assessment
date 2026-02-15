const Datastore = require('nedb-promises');
const path = require('path');

// Initialize datastores (in-memory for Render, but could be files)
const useFiles = process.env.NODE_ENV === 'production';
const dbPath = (filename) => useFiles ? path.join('/tmp', filename) : null;

const db = {
    users: Datastore.create({ filename: dbPath('users.db'), autoload: true }),
    events: Datastore.create({ filename: dbPath('events.db'), autoload: true }),
    registrations: Datastore.create({ filename: dbPath('registrations.db'), autoload: true })
};

// Helper to mimic Mongoose Query chaining
class MockQuery {
    constructor(promise) {
        this.promise = promise;
        this._sort = null;
        this._skip = 0;
        this._limit = 0;
    }

    sort(val) { this._sort = val; return this; }
    skip(val) { this._skip = val; return this; }
    limit(val) { this._limit = val; return this; }

    async exec() {
        let results = await this.promise;

        // Basic sorting (Mongoose style: { field: 1/-1 })
        if (this._sort) {
            const field = Object.keys(this._sort)[0];
            const order = this._sort[field];
            results.sort((a, b) => {
                if (a[field] < b[field]) return order === 1 ? -1 : 1;
                if (a[field] > b[field]) return order === 1 ? 1 : -1;
                return 0;
            });
        }

        if (this._skip) results = results.slice(this._skip);
        if (this._limit) results = results.slice(0, this._limit);

        return results;
    }

    // Handle being awaited directly
    then(onFulfilled, onRejected) {
        return this.exec().then(onFulfilled, onRejected);
    }
}

class MockModel {
    constructor(collectionName) {
        this.collection = db[collectionName];
    }

    find(query = {}) {
        // Special case for $text search (NeDB doesn't support $text)
        if (query.$text) {
            const search = query.$text.$search;
            delete query.$text;
            const regex = new RegExp(search, 'i');
            query.$or = [{ name: regex }, { description: regex }, { organizer: regex }];
        }
        // Handle regex in location
        if (query.location && typeof query.location === 'object' && query.location.$regex) {
            query.location = new RegExp(query.location.$regex, 'i');
        }

        return new MockQuery(this.collection.find(query));
    }

    async findOne(query) {
        return await this.collection.findOne(query);
    }

    async findById(id) {
        return await this.collection.findOne({ _id: id });
    }

    async create(data) {
        if (Array.isArray(data)) {
            return await this.collection.insertMany(data);
        }
        return await this.collection.insert(data);
    }

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

    async countDocuments(query = {}) {
        // Fix for $text in count too
        if (query.$text) {
            const search = query.$text.$search;
            delete query.$text;
            const regex = new RegExp(search, 'i');
            query.$or = [{ name: regex }, { description: regex }, { organizer: regex }];
        }
        return await this.collection.count(query);
    }

    async deleteOne(query) {
        return await this.collection.remove(query);
    }

    async findByIdAndDelete(id) {
        return await this.collection.remove({ _id: id });
    }

    async updateOne(query, update) {
        const set = update.$set || update;
        return await this.collection.update(query, { $set: set });
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
