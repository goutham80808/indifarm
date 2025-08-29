const Rating = require("../models/RatingModel");
const Order = require("../models/OrderModel");
const User = require("../models/UserModel");

// @desc    Create a rating
// @route   POST /api/ratings
// @access  Private
exports.createRating = async (req, res) => {
  try {
    const { orderId, rating, review, isAnonymous } = req.body;
    const consumerId = req.user._id;

    // Check if order exists and belongs to the consumer
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.consumer.toString() !== consumerId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to rate this order",
      });
    }

    // Check if order is completed
    if (order.status !== "completed" && order.status !== "accepted") {
      return res.status(400).json({
        success: false,
        message: "Can only rate accepted or completed orders",
      });
    }

    // Check if already rated
    if (order.rated) {
      return res.status(400).json({
        success: false,
        message: "Order has already been rated",
      });
    }

    // Create rating
    const newRating = await Rating.create({
      consumer: consumerId,
      farmer: order.farmer,
      order: orderId,
      rating,
      review,
      isAnonymous,
    });

    // Update order as rated
    order.rated = true;
    await order.save();

    // Update farmer's average rating
    await updateFarmerRating(order.farmer);

    res.status(201).json({
      success: true,
      data: newRating,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Get ratings for a farmer
// @route   GET /api/ratings/farmer/:farmerId
// @access  Public
exports.getFarmerRatings = async (req, res) => {
  try {
    const { farmerId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const ratings = await Rating.find({ farmer: farmerId })
      .populate("consumer", "name")
      .populate("order", "items totalAmount")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Rating.countDocuments({ farmer: farmerId });

    res.json({
      success: true,
      data: ratings,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Get rating for a specific order
// @route   GET /api/ratings/order/:orderId
// @access  Private
exports.getOrderRating = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user._id;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Check if user is authorized to view this rating
    if (
      order.consumer.toString() !== userId.toString() &&
      order.farmer.toString() !== userId.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this rating",
      });
    }

    const rating = await Rating.findOne({ order: orderId }).populate(
      "consumer",
      "name"
    );

    res.json({
      success: true,
      data: rating,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Update a rating
// @route   PUT /api/ratings/:id
// @access  Private
exports.updateRating = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, review, isAnonymous } = req.body;
    const userId = req.user._id;

    const existingRating = await Rating.findById(id);
    if (!existingRating) {
      return res.status(404).json({
        success: false,
        message: "Rating not found",
      });
    }

    // Check if user is authorized to update this rating
    if (existingRating.consumer.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this rating",
      });
    }

    // Update rating
    existingRating.rating = rating;
    existingRating.review = review;
    existingRating.isAnonymous = isAnonymous;
    await existingRating.save();

    // Update farmer's average rating
    await updateFarmerRating(existingRating.farmer);

    res.json({
      success: true,
      data: existingRating,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Delete a rating
// @route   DELETE /api/ratings/:id
// @access  Private
exports.deleteRating = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const rating = await Rating.findById(id);
    if (!rating) {
      return res.status(404).json({
        success: false,
        message: "Rating not found",
      });
    }

    // Check if user is authorized to delete this rating
    if (rating.consumer.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this rating",
      });
    }

    // Update order as not rated
    await Order.findByIdAndUpdate(rating.order, { rated: false });

    // Delete rating
    await Rating.findByIdAndDelete(id);

    // Update farmer's average rating
    await updateFarmerRating(rating.farmer);

    res.json({
      success: true,
      message: "Rating deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Helper function to update farmer's average rating
async function updateFarmerRating(farmerId) {
  try {
    const ratings = await Rating.find({ farmer: farmerId });
    
    if (ratings.length === 0) {
      await User.findByIdAndUpdate(farmerId, {
        averageRating: 0,
        totalRatings: 0,
      });
      return;
    }

    const totalRating = ratings.reduce((sum, rating) => sum + rating.rating, 0);
    const averageRating = totalRating / ratings.length;

    await User.findByIdAndUpdate(farmerId, {
      averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
      totalRatings: ratings.length,
    });
  } catch (error) {
    console.error("Error updating farmer rating:", error);
  }
}
