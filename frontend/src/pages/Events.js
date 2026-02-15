import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EventCard from '../components/EventCard';
import SearchFilter from '../components/SearchFilter';
import API_URL from '../config/api';
import './Events.css';

const Events = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        category: '',
        location: '',
        startDate: '',
        endDate: ''
    });

    // Fetch events from API
    const fetchEvents = async (pageNum = 1, search = '', filterParams = {}) => {
        try {
            setLoading(true);
            setError('');

            // Build query parameters
            const params = {
                page: pageNum,
                limit: 10,
                search,
                ...filterParams
            };

            const response = await axios.get(`${API_URL}/api/events`, { params });

            // If first page, replace events; otherwise, append
            if (pageNum === 1) {
                setEvents(response.data.events);
            } else {
                setEvents(prev => [...prev, ...response.data.events]);
            }

            setHasMore(response.data.hasMore);
        } catch (err) {
            const errorMsg = err.response?.data?.error || err.response?.data?.message || 'Failed to load events. Please try again.';
            setError(errorMsg);
            console.error('Error fetching events:', err);
        } finally {
            setLoading(false);
        }
    };

    // Load events on component mount
    useEffect(() => {
        fetchEvents(1, searchTerm, filters);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Handle search
    const handleSearch = (search) => {
        setSearchTerm(search);
        setPage(1);
        fetchEvents(1, search, filters);
    };

    // Handle filters
    const handleFilter = (newFilters) => {
        setFilters(newFilters);
        setPage(1);
        fetchEvents(1, searchTerm, newFilters);
    };

    // Load more events
    const loadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchEvents(nextPage, searchTerm, filters);
    };

    return (
        <div className="events-container">
            <div className="events-header">
                <h1>Discover Events</h1>
                <p>Browse and register for amazing events happening around you</p>
            </div>

            <SearchFilter onSearch={handleSearch} onFilter={handleFilter} />

            {error && <div className="error-message">{error}</div>}

            <div className="events-grid">
                {events.map(event => (
                    <EventCard key={event._id} event={event} />
                ))}
            </div>

            {loading && <div className="loading">Loading events...</div>}

            {!loading && events.length === 0 && (
                <div className="no-events">
                    <p>No events found. Try adjusting your search or filters.</p>
                </div>
            )}

            {!loading && hasMore && events.length > 0 && (
                <div className="load-more-container">
                    <button onClick={loadMore} className="load-more-button">
                        Load More Events
                    </button>
                </div>
            )}
        </div>
    );
};

export default Events;
