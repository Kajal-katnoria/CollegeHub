const express = require("express");

const auth = require("../middleware/auth");

const {
  createEvent,
  getEvents,
  getEvent,
  updateEvent,
  deleteEvent,
  registerEvent
} = require("../controllers/eventController");

const router = express.Router();

router.post("/", auth, createEvent);

router.get("/", getEvents);

router.get("/:id", getEvent);

router.put("/:id", auth, updateEvent);

router.delete("/:id", auth, deleteEvent);
router.post(
  "/register/:id",
  auth,
  registerEvent
);

module.exports = router;