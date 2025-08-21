const express = require("express");
const {
  subscribe,
  unsubscribe,
  getAllSubscribers,
  getSubscriberCount,
} = require("../controllers/newsletterController");
const { verifyToken, isAdmin } = require("../utils/authMiddleware");

const router = express.Router();

// Public routes
router.post("/subscribe", subscribe);
router.post("/unsubscribe", unsubscribe);
router.get("/count", getSubscriberCount);

// Admin routes
router.get("/subscribers", verifyToken, isAdmin, getAllSubscribers);

module.exports = router;
