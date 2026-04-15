import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Volunteer.css'; 

const Volunteer = () => {
    
    const [recentVolunteers, setRecentVolunteers] = useState([]);
    const [events, setEvents] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    
    
    const [currentPage, setCurrentPage] = useState(1);
    const eventsPerPage = 3;

    
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    
    useEffect(() => {
        const fetchVolunteers = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/volunteer-registrations');
                const data = await res.json();
                setRecentVolunteers(data);
            } catch (err) {
                console.error("Error fetching volunteers", err);
            }
        };
        fetchVolunteers();
    }, []);

    
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/events');
                const data = await res.json();
                setEvents(data);
            } catch (err) {
                console.error("Error fetching events", err);
            }
        };
        fetchEvents();
    }, []);

    
    const today = new Date();
    today.setHours(0, 0, 0, 0); 

    
    const filteredEvents = events.filter(event => {
        const eventDate = new Date(event.date);
        const isFutureOrToday = eventDate >= today;
        const matchesLocation = event.location && event.location.toLowerCase().includes(searchQuery.toLowerCase());
        
        return isFutureOrToday && matchesLocation;
    });

    
    const indexOfLastEvent = currentPage * eventsPerPage;
    const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
    const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);
    const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

    
    const upcomingEventsMap = {};
    events.forEach(event => {
        const eventDate = new Date(event.date);
        if (eventDate >= today) {
            upcomingEventsMap[event.slug] = event.title; 
        }
    });

    
    const upcomingVolunteers = recentVolunteers.filter(vol => upcomingEventsMap[vol.eventId]);

    return (
        <div className="volunteer-page">
            {/* The Header */}
            <header className="volunteer-header">
                <h1>Volunteer Registration</h1>
            </header>

            {/* The Search Bar */}
            <section id="home" className="search-bar">
                <input 
                    type="text" 
                    placeholder="Search by location (city, zip code, etc.)" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button>Search</button>
            </section>

            {/* The Available Opportunities List */}
            <section id="opportunities" className="opportunities">
                <h2>Available Opportunities</h2>
                
                {filteredEvents.length === 0 ? (
                    <p style={{ textAlign: 'center', marginTop: '20px' }}>No upcoming events found for this location.</p>
                ) : (
                    <>
                        {/* Map over the paginated events */}
                        {currentEvents.map((event) => (
                            <div className="opportunity" key={event._id}>
                                <div>
                                    <h3>{event.title}</h3>
                                    <p>Date: {new Date(event.date).toLocaleDateString()} | Location: {event.location}</p>
                                </div>
                                <Link to={`/volunteer-form/${event.slug}`} className="register-btn">
                                    Register to Volunteer
                                </Link>
                            </div>
                        ))}

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div className="pagination-controls">
                                <button 
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="page-btn"
                                >
                                    &laquo; Prev
                                </button>
                                <span>Page {currentPage} of {totalPages}</span>
                                <button 
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="page-btn"
                                >
                                    Next &raquo;
                                </button>
                            </div>
                        )}
                    </>
                )}
            </section>

            {/* UPCOMING HEROES SECTION */}
            <section className="recent-heroes-section">
                <h2 style={{ textAlign: 'center', color: '#4CAF50', marginBottom: '20px' }}>Our Upcoming Heroes</h2>
                
                {upcomingVolunteers.length === 0 ? (
                    <p style={{ textAlign: 'center' }}>Be the first to register for an upcoming event!</p>
                ) : (
                    <ul style={{ listStyleType: 'none', padding: 0 }}>
                        {/* Reverse the array to show newest first, then slice to limit to 5 */}
                        {[...upcomingVolunteers].reverse().slice(0, 5).map((vol) => (
                            <li key={vol._id} style={{ margin: '10px 0', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                                <strong>{vol.fullName}</strong> is volunteering for <span style={{ color: '#4CAF50', fontWeight: 'bold' }}>
                                    {upcomingEventsMap[vol.eventId]}
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </div>
    );
};

export default Volunteer;