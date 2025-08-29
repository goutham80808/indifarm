const mongoose = require("mongoose");

const RatingSchema = new mongoose.Schema(
  {
    consumer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    review: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    isAnonymous: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure one rating per order per consumer
RatingSchema.index({ order: 1, consumer: 1 }, { unique: true });

// Ensure one rating per farmer per consumer (optional - remove if you want multiple ratings per farmer)
// RatingSchema.index({ farmer: 1, consumer: 1 }, { unique: true });

module.exports = mongoose.model("Rating", RatingSchema);
