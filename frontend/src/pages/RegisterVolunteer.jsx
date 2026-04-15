import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './RegisterVolunteer.css'; 

const RegisterVolunteer = () => {
    const { eventId } = useParams(); 
    const navigate = useNavigate();

    const [events, setEvents] = useState([]);

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        eventId: eventId || '', 
        notes: ''
    });

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/events');
                const data = await response.json();
                
                const today = new Date();
                today.setHours(0, 0, 0, 0); 
                
                const upcomingEvents = data.filter(event => {
                    const eventDate = new Date(event.date);
                    return eventDate >= today;
                });

                setEvents(upcomingEvents);
            } catch (error) {
                console.error("Error fetching events for the form", error);
            }
        };

        fetchEvents();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/volunteer-registrations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                alert('Registration successful!');
                navigate('/volunteer'); 
            } else {
                alert('Failed to register. Please try again.');
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
       
        <div className="register-page-wrapper">
            <div className="register-container">
                <h2>Register as a Volunteer</h2>
                <form onSubmit={handleSubmit} className="register-form">
                    
                    <label>Full Name:</label>
                    <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required />

                    <label>Email Address:</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required />

                    <label>Phone Number:</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />

                    <label>Select Event:</label>
                    <select name="eventId" value={formData.eventId} onChange={handleChange} required>
                        <option value="" disabled>-- Choose an Event --</option>
                        {events.map((event) => (
                            <option key={event._id} value={event.slug}>
                                {event.title}
                            </option>
                        ))}
                    </select>

                    <label>Additional Notes:</label>
                    <textarea name="notes" value={formData.notes} onChange={handleChange} rows="4" placeholder="Let us know any special requests or skills..."></textarea>

                    <button type="submit" className="submit-btn">
                        Submit Registration
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RegisterVolunteer;