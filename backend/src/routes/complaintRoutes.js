const express = require("express");

const auth = require("../middleware/auth");

const {
  createComplaint,
  getComplaints,
  updateComplaint
} = require("../controllers/complaintController");

const router = express.Router();

router.post("/", auth, createComplaint);

router.get("/", getComplaints);

router.put("/:id", auth, updateComplaint);

module.exports = router;