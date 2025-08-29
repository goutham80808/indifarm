const express = require("express");
const {
  createRating,
  getFarmerRatings,
  getOrderRating,
  updateRating,
  deleteRating,
} = require("../controllers/ratingController");
const { verifyToken } = require("../utils/authMiddleware");

const router = express.Router();

// Public route - no auth required
router.get("/farmer/:farmerId", getFarmerRatings);

// All other routes require authentication
router.use(verifyToken);

// Create a rating
router.post("/", createRating);

// Get rating for a specific order
router.get("/order/:orderId", getOrderRating);

// Update a rating
router.put("/:id", updateRating);

// Delete a rating
router.delete("/:id", deleteRating);

module.exports = router;
