import { tryCatchWrapper } from "../utils/tryCatcher.js";
import ErrorResponse from "../middleware/errorResponse.js";
import Event from "../models/event.model.js";

export const createEvent = tryCatchWrapper(async (req, res) => {
  const { title, description, location, date } = req.body;
  if (!title || !description || !location || !date) {
    throw new ErrorResponse("Please provide all fields", 400);
  }
  const event = await Event({
    title,
    description,
    location,
    date,
    ownerId: req.user._id,
  });
  await event.save();
  res.status(201).json({
    success: true,
    message: "Event created successfully",
    event: {
      id: event._id,
      title: event.title,
      description: event.description,
      date: event.date,
      location: event.location,
    },
  });
});

export const getEvents = tryCatchWrapper(async (req, res) => {
  const events = await Event.find({});
  res.status(200).json({
    success: true,
    events,
  });
});

export const getEvent = tryCatchWrapper(async (req, res) => {
  const eventId = req.params.id;
  const event = await Event.findById(eventId);
  if (!event) {
    throw new ErrorResponse("Event not found", 404);
  }
  res.status(200).json({
    success: true,
    event: {
      id: event._id,
      title: event.title,
      description: event.description,
      date: event.date,
      location: event.location,
    },
  });
});

export const updateEvent = tryCatchWrapper(async (req, res) => {
  const eventId = req.params.id;
  const event = await Event.findById(eventId);
  if (!event) {
    throw new ErrorResponse("Event not found", 404);
  }
  if (req.user._id === event.ownerId) {
    throw new ErrorResponse("You cannot Register for event", 401);
  } else {
    if (event.users.includes(req.user._id)) {
      event.users = event.users.filter((user) => user !== req.user._id);
      await event.save();
      res.status(200).json({
        success: true,
        message: "UnRegistered successfully",
      });
    } else {
      event.users.push(req.user._id);
      await event.save();
      res.status(200).json({
        success: true,
        message: "Registered successfully",
      });
    }
  }
});

export const deleteEvent = tryCatchWrapper(async (req, res) => {
  const eventId = req.params.id;
  const event = await Event.findById(eventId);
  if (!event) {
    throw new ErrorResponse("Event not found", 404);
  }
  if (req.user._id !== event.ownerId) {
    throw new ErrorResponse("You cannot delete event", 401);
  }
  await event.delete();
  res.status(200).json({
    success: true,
    message: "Event deleted successfully",
  });
});

export const getParticularUserEvents = tryCatchWrapper(async (req, res) => {
  const events = await Event.find({ ownerId: req.user._id });
  res.status(200).json({
    success: true,
    events,
  });
});
