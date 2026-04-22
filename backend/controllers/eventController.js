const Event = require('../models/Event');
const User = require('../models/User');

// 1. Create Event (Make sure you keep your existing code for this!)
const createEvent = async (req, res) => {
    try {
        const newEvent = new Event(req.body);
        await newEvent.save();
        res.status(201).json(newEvent);
    } catch (error) {
        res.status(400).json({ message: 'Error creating event', error: error.message });
    }
};

// 2. Get Event by Slug (Make sure you keep your existing code for this!)
const getEventBySlug = async (req, res) => {
    try {
        const event = await Event.findOne({ slug: req.params.slug });
        if (!event) return res.status(404).json({ message: 'Event not found' });
        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching event', error: error.message });
    }
};

// 3. Get All Events (The NEW function we added)
const getAllEvents = async (req, res) => {
    try {
        const events = await Event.find({})
            .populate({
                path: 'registeredVolunteers',
                select: 'name email mobile',
                model: 'User'
            });
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching events', error: error.message });
    }
};

// 4. Delete Event
const deleteEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });
        res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting event', error: error.message });
    }
};

// 5. Register for Event
const registerForEvent = async (req, res) => {
    try {
        const eventId = req.params.id;
        const userId = req.user._id;

        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        if (event.registeredVolunteers.includes(userId)) {
            return res.status(400).json({ message: 'Already registered for this event' });
        }

        if (event.slots > 0 && event.registeredVolunteers.length >= event.slots) {
             return res.status(400).json({ message: 'Event slots are full' });
        }

        event.registeredVolunteers.push(userId);
        await event.save();
        res.status(200).json({ message: 'Successfully registered for the event', event });
    } catch (error) {
        res.status(500).json({ message: 'Error registering for event', error: error.message });
    }
};

// Export all functions
module.exports = {
    createEvent,
    getEventBySlug,
    getAllEvents,
    deleteEvent,
    registerForEvent
};