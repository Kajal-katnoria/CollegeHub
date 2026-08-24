const prisma = require("../config/db");
const { redisClient } = require("../config/redis");


// =====================================================
// CREATE EVENT
// =====================================================

const createEvent = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("USER:", req.user);

    const {
      title,
      description,
      location,
      date
    } = req.body;

    // Validation
    if (!title || !description || !location || !date) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const eventDate = new Date(date);

    if (isNaN(eventDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid date"
      });
    }

    const event = await prisma.event.create({
      data: {
        title,
        description,
        location,
        date: eventDate,
        createdBy: req.user.id
      }
    });

    console.log("EVENT CREATED:", event);

    // IMPORTANT:
    // New event means old Redis cache is outdated
    await redisClient.del("events");

    console.log("EVENT CACHE CLEARED");

    res.status(201).json({
      success: true,
      message: "Event created successfully",
      event
    });

  } catch (error) {
    console.error("CREATE EVENT ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create event",
      error: error.message
    });
  }
};


// =====================================================
// GET ALL EVENTS
// =====================================================

const getEvents = async (req, res) => {
  try {

    // Check Redis first
    const cachedEvents = await redisClient.get("events");

    if (cachedEvents) {
      console.log("EVENTS FROM REDIS");

      return res.json(
        JSON.parse(cachedEvents)
      );
    }

    // Redis MISS
    console.log("EVENTS FROM DATABASE");

    const events = await prisma.event.findMany({
      orderBy: {
        date: "asc"
      },

      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },

        _count: {
          select: {
            registrations: true
          }
        }
      }
    });

    // Store result in Redis for 5 minutes
    await redisClient.setEx(
      "events",
      300,
      JSON.stringify(events)
    );

    console.log("EVENTS SAVED TO REDIS");

    res.json(events);

  } catch (error) {
    console.error("GET EVENTS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch events",
      error: error.message
    });
  }
};


// =====================================================
// GET SINGLE EVENT
// =====================================================

const getEvent = async (req, res) => {
  try {

    const eventId = Number(req.params.id);

    if (isNaN(eventId)) {
      return res.status(400).json({
        message: "Invalid event ID"
      });
    }

    const event = await prisma.event.findUnique({
      where: {
        id: eventId
      },

      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },

        registrations: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        },

        _count: {
          select: {
            registrations: true
          }
        }
      }
    });

    if (!event) {
      return res.status(404).json({
        message: "Event not found"
      });
    }

    res.json(event);

  } catch (error) {
    console.error("GET EVENT ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch event",
      error: error.message
    });
  }
};


// =====================================================
// UPDATE EVENT
// =====================================================

const updateEvent = async (req, res) => {
  try {

    const eventId = Number(req.params.id);

    if (isNaN(eventId)) {
      return res.status(400).json({
        message: "Invalid event ID"
      });
    }

    const {
      title,
      description,
      location,
      date
    } = req.body;

    if (!title || !description || !location || !date) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    const eventDate = new Date(date);

    if (isNaN(eventDate.getTime())) {
      return res.status(400).json({
        message: "Invalid date"
      });
    }

    const event = await prisma.event.update({
      where: {
        id: eventId
      },

      data: {
        title,
        description,
        location,
        date: eventDate
      }
    });

    // Event changed → clear old cache
    await redisClient.del("events");

    console.log("EVENT CACHE CLEARED AFTER UPDATE");

    res.json({
      success: true,
      message: "Event updated successfully",
      event
    });

  } catch (error) {
    console.error("UPDATE EVENT ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update event",
      error: error.message
    });
  }
};


// =====================================================
// REGISTER FOR EVENT
// =====================================================

const registerEvent = async (req, res) => {
  try {

    const eventId = Number(req.params.id);
    const userId = Number(req.user.id);

    if (isNaN(eventId)) {
      return res.status(400).json({
        message: "Invalid event ID"
      });
    }

    // Check event exists
    const event = await prisma.event.findUnique({
      where: {
        id: eventId
      }
    });

    if (!event) {
      return res.status(404).json({
        message: "Event not found"
      });
    }

    // Prevent duplicate registration
    const existingRegistration =
      await prisma.registration.findFirst({
        where: {
          userId,
          eventId
        }
      });

    if (existingRegistration) {
      return res.status(400).json({
        message: "You are already registered for this event"
      });
    }

    const registration =
      await prisma.registration.create({
        data: {
          userId,
          eventId
        }
      });

    // Registration count changed
    await redisClient.del("events");

    console.log("EVENT CACHE CLEARED AFTER REGISTRATION");

    res.status(201).json({
      success: true,
      message: "Registered for event successfully",
      registration
    });

  } catch (error) {
    console.error("REGISTER EVENT ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to register for event",
      error: error.message
    });
  }
};


// =====================================================
// DELETE EVENT
// =====================================================

const deleteEvent = async (req, res) => {
  try {

    const eventId = Number(req.params.id);

    if (isNaN(eventId)) {
      return res.status(400).json({
        message: "Invalid event ID"
      });
    }

    await prisma.event.delete({
      where: {
        id: eventId
      }
    });

    // Event deleted → clear cache
    await redisClient.del("events");

    console.log("EVENT CACHE CLEARED AFTER DELETE");

    res.json({
      success: true,
      message: "Event deleted successfully"
    });

  } catch (error) {
    console.error("DELETE EVENT ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete event",
      error: error.message
    });
  }
};


// =====================================================
// EXPORT
// =====================================================

module.exports = {
  createEvent,
  getEvents,
  getEvent,
  updateEvent,
  deleteEvent,
  registerEvent
};