const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");
const upload = require("../middleware/upload");

const {
  createItem,
  getItems,
  getItem,
  updateItem,
  deleteItem
} = require("../controllers/marketplaceController");


// CREATE
router.post(
  "/",
  auth,
  upload.single("image"),
  createItem
);


// GET ALL
router.get(
  "/",
  getItems
);


// GET ONE
router.get(
  "/:id",
  getItem
);


// UPDATE
router.put(
  "/:id",
  auth,
  updateItem
);


// DELETE
router.delete(
  "/:id",
  auth,
  deleteItem
);


module.exports = router;