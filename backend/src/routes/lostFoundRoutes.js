const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/auth");

const {
  getItems,
  createItem,
  deleteItem,
} = require("../controllers/lostFoundController");


router.get(
  "/",
  authMiddleware,
  getItems
);

router.post(
  "/",
  authMiddleware,
  createItem
);

router.delete(
  "/:id",
  authMiddleware,
  deleteItem
);


module.exports = router;