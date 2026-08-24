const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/auth");

const {
  getClubs,
  createClub,
  joinClub,
  leaveClub,
} = require("../controllers/clubController");


router.get(
  "/",
  authMiddleware,
  getClubs
);

router.post(
  "/",
  authMiddleware,
  createClub
);

router.post(
  "/:id/join",
  authMiddleware,
  joinClub
);

router.delete(
  "/:id/leave",
  authMiddleware,
  leaveClub
);


module.exports = router;