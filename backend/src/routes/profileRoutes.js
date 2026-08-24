const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");

const upload = require("../middleware/upload");

const {
  getProfile,
  updateProfile,
  updateProfilePicture,
  changePassword,
} = require("../controllers/profileController");


// GET PROFILE

router.get(
  "/",
  auth,
  getProfile
);


// UPDATE PROFILE

router.put(
  "/",
  auth,
  updateProfile
);


// PROFILE PICTURE

router.put(
  "/picture",
  auth,
  upload.single("profilePicture"),
  updateProfilePicture
);


// CHANGE PASSWORD

router.put(
  "/password",
  auth,
  changePassword
);


module.exports = router;