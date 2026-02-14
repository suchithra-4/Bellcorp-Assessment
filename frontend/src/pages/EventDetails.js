import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import './EventDetails.css';

const EventDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token, isAuthenticated } = useContext(AuthContext);

    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [actionLoading, setActionLoading] = useState(false);
    const [message, setMessage] = useState('');

    // Fetch event details
    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/events/${id}`);
                setEvent(response.data.event);
            } catch (err) {
                setError('Failed to load event details.');
                console.error('Error fetching event:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchEvent();
    }, [id]);

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

    // Handle event registration
    const handleRegister = async () => {
        if (!isAuthenticated()) {
            navigate('/login');
            return;
        }

        setActionLoading(true);
        setMessage('');
        setError('');

        try {
            const response = await axios.post(
                'http://localhost:5000/api/registrations',
                { eventId: id },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setMessage(response.data.message);
            // Update available seats
            setEvent(prev => ({
                ...prev,
                availableSeats: prev.availableSeats - 1
            }));
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to register for event.');
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return <div className="loading">Loading event details...</div>;
    }

    if (error && !event) {
        return <div className="error-container">{error}</div>;
    }

    return (
        <div className="event-details-container">
            <div className="event-details-box">
                <div className="event-details-header">
                    <h1>{event.name}</h1>
                    <span className="event-category-badge">{event.category}</span>
                </div>

                <div className="event-info">
                    <div className="info-row">
                        <strong>Organizer:</strong>
                        <span>{event.organizer}</span>
                    </div>

                    <div className="info-row">
                        <strong>Location:</strong>
                        <span>{event.location}</span>
                    </div>

                    <div className="info-row">
                        <strong>Date & Time:</strong>
                        <span>{formatDate(event.date)}</span>
                    </div>

                    <div className="info-row">
                        <strong>Available Seats:</strong>
                        <span className={event.availableSeats === 0 ? 'no-seats' : 'has-seats'}>
                            {event.availableSeats} / {event.capacity}
                        </span>
                    </div>

                    {event.tags && event.tags.length > 0 && (
                        <div className="info-row">
                            <strong>Tags:</strong>
                            <div className="tags">
                                {event.tags.map((tag, index) => (
                                    <span key={index} className="tag">{tag}</span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="event-description">
                    <h3>About This Event</h3>
                    <p>{event.description}</p>
                </div>

                {message && <div className="success-message">{message}</div>}
                {error && <div className="error-message">{error}</div>}

                <div className="event-actions">
                    {event.availableSeats > 0 ? (
                        <button
                            onClick={handleRegister}
                            className="register-button"
                            disabled={actionLoading}
                        >
                            {actionLoading ? 'Registering...' : 'Register for Event'}
                        </button>
                    ) : (
                        <button className="register-button disabled" disabled>
                            Event Full
                        </button>
                    )}

                    <button onClick={() => navigate('/')} className="back-button">
                        Back to Events
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EventDetails;
