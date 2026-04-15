import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import './VolunteerForm.css';

const VolunteerForm = () => {
    const { eventId } = useParams(); 
    const [eventDetails, setEventDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                
                const response = await fetch(`http://localhost:5000/api/events/${eventId}`);
                
                if (!response.ok) throw new Error('Event not found');
                
                const data = await response.json();
                setEventDetails(data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setError(true);
                setLoading(false);
            }
        };

        fetchEvent();
    }, [eventId]);

    if (loading) return <div className="volunteer-form-page"><main className="volunteer-form-main"><h2>Loading event details...</h2></main></div>;

    if (error || !eventDetails) {
        return (
            <div className="volunteer-form-page">
                <main className="volunteer-form-main">
                    <h2>Event Not Found</h2>
                    <p>Sorry, we couldn't find the details for this volunteer opportunity.</p>
                    <Link to="/volunteer" className="volunteer-form-btn">Back to Opportunities</Link>
                </main>
            </div>
        );
    }

    return (
        <div className="volunteer-form-page">
            <header className="volunteer-form-header">
                <h1>{eventDetails.title}</h1>
            </header>

            <main className="volunteer-form-main">
                <h2>Event Details</h2>
                <div className="volunteer-form-details">
                    <p><strong>Date:</strong> {eventDetails.date}</p>
                    <p><strong>Location:</strong> {eventDetails.location}</p>
                    <p><strong>Description:</strong> {eventDetails.description}</p>
                    <p><strong>Organizer:</strong> {eventDetails.organizer}</p>
                    <p><strong>Contact:</strong> {eventDetails.contact}</p>
                </div>
                
                <Link to={`/register/${eventId}`} className="volunteer-form-btn">
                Proceed to Registration
                </Link>
            </main>
        </div>
    );
};

export default VolunteerForm;