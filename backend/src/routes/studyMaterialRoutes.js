const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");
const upload = require("../middleware/upload");

const {
    createStudyMaterial
} = require("../controllers/studyMaterialController");

router.post(
    "/",
    auth,
    upload.single("file"),
    createStudyMaterial
);

module.exports = router;