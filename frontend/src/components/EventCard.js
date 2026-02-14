import React from 'react';
import { useNavigate } from 'react-router-dom';
import './EventCard.css';

const EventCard = ({ event }) => {
    const navigate = useNavigate();

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

    return (
        <div className="event-card" onClick={() => navigate(`/events/${event._id}`)}>
            <div className="event-card-header">
                <h3 className="event-name">{event.name}</h3>
                <span className="event-category">{event.category}</span>
            </div>

            <div className="event-details">
                <p className="event-organizer">
                    <strong>Organizer:</strong> {event.organizer}
                </p>
                <p className="event-location">
                    <strong>Location:</strong> {event.location}
                </p>
                <p className="event-date">
                    <strong>Date:</strong> {formatDate(event.date)}
                </p>
                <p className="event-description">
                    {event.description.substring(0, 100)}...
                </p>
            </div>

            <div className="event-footer">
                <span className={`seats ${event.availableSeats === 0 ? 'full' : ''}`}>
                    {event.availableSeats > 0
                        ? `${event.availableSeats} seats available`
                        : 'Fully Booked'}
                </span>
            </div>
        </div>
    );
};

export default EventCard;
