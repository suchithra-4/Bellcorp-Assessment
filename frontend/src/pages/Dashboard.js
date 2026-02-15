import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import API_URL from '../config/api';
import './Dashboard.css';

const Dashboard = () => {
    const navigate = useNavigate();
    const { token } = useContext(AuthContext);

    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [pastEvents, setPastEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [cancellingId, setCancellingId] = useState(null);

    // Fetch user's registered events
    useEffect(() => {
        const fetchMyEvents = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/registrations/my-events`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setUpcomingEvents(response.data.upcoming);
                setPastEvents(response.data.past);
            } catch (err) {
                setError('Failed to load your events.');
                console.error('Error fetching events:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchMyEvents();
    }, [token]);

    // Format date to readable string
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Handle registration cancellation
    const handleCancel = async (registrationId) => {
        if (!window.confirm('Are you sure you want to cancel this registration?')) {
            return;
        }

        setCancellingId(registrationId);

        try {
            await axios.delete(`${API_URL}/api/registrations/${registrationId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            // Remove cancelled event from upcoming events
            setUpcomingEvents(prev => prev.filter(reg => reg._id !== registrationId));
            alert('Registration cancelled successfully!');
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to cancel registration.');
        } finally {
            setCancellingId(null);
        }
    };

    if (loading) {
        return <div className="loading">Loading your events...</div>;
    }

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1>My Dashboard</h1>
                <p>Manage your event registrations</p>
            </div>

            {error && <div className="error-message">{error}</div>}

            {/* Summary Stats */}
            <div className="stats-container">
                <div className="stat-card">
                    <h3>{upcomingEvents.length}</h3>
                    <p>Upcoming Events</p>
                </div>
                <div className="stat-card">
                    <h3>{pastEvents.length}</h3>
                    <p>Past Events</p>
                </div>
                <div className="stat-card">
                    <h3>{upcomingEvents.length + pastEvents.length}</h3>
                    <p>Total Registrations</p>
                </div>
            </div>

            {/* Upcoming Events */}
            <div className="events-section">
                <h2>Upcoming Events</h2>
                {upcomingEvents.length === 0 ? (
                    <div className="no-events">
                        <p>You haven't registered for any upcoming events yet.</p>
                        <button onClick={() => navigate('/')} className="browse-button">
                            Browse Events
                        </button>
                    </div>
                ) : (
                    <div className="events-list">
                        {upcomingEvents.map(registration => (
                            <div key={registration._id} className="event-item">
                                <div className="event-item-content">
                                    <h3>{registration.eventId.name}</h3>
                                    <p className="event-meta">
                                        <strong>Date:</strong> {formatDate(registration.eventId.date)}
                                    </p>
                                    <p className="event-meta">
                                        <strong>Location:</strong> {registration.eventId.location}
                                    </p>
                                    <p className="event-meta">
                                        <strong>Organizer:</strong> {registration.eventId.organizer}
                                    </p>
                                    <p className="registered-date">
                                        Registered on: {formatDate(registration.registeredAt)}
                                    </p>
                                </div>
                                <div className="event-item-actions">
                                    <button
                                        onClick={() => navigate(`/events/${registration.eventId._id}`)}
                                        className="view-button"
                                    >
                                        View Details
                                    </button>
                                    <button
                                        onClick={() => handleCancel(registration._id)}
                                        className="cancel-button"
                                        disabled={cancellingId === registration._id}
                                    >
                                        {cancellingId === registration._id ? 'Cancelling...' : 'Cancel Registration'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Past Events */}
            {pastEvents.length > 0 && (
                <div className="events-section">
                    <h2>Past Events</h2>
                    <div className="events-list">
                        {pastEvents.map(registration => (
                            <div key={registration._id} className="event-item past">
                                <div className="event-item-content">
                                    <h3>{registration.eventId.name}</h3>
                                    <p className="event-meta">
                                        <strong>Date:</strong> {formatDate(registration.eventId.date)}
                                    </p>
                                    <p className="event-meta">
                                        <strong>Location:</strong> {registration.eventId.location}
                                    </p>
                                </div>
                                <div className="event-item-actions">
                                    <button
                                        onClick={() => navigate(`/events/${registration.eventId._id}`)}
                                        className="view-button"
                                    >
                                        View Details
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
