const Event = require('../models/Event');

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
        const events = await Event.find({});
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching events', error: error.message });
    }
};

// Export all three functions
module.exports = {
    createEvent,
    getEventBySlug,
    getAllEvents 
};