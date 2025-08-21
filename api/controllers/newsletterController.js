const Newsletter = require("../models/NewsletterModel");
const { isEmailConfigured, sendEmail } = require("../utils/emailService");

// @desc    Subscribe to newsletter
// @route   POST /api/newsletter/subscribe
// @access  Public
exports.subscribe = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }

    // Check if email already exists
    const existingSubscriber = await Newsletter.findOne({ email: email.toLowerCase() });

    if (existingSubscriber) {
      if (existingSubscriber.isActive) {
        return res
          .status(400)
          .json({ success: false, message: "Email is already subscribed" });
      } else {
        // Reactivate subscription
        existingSubscriber.isActive = true;
        existingSubscriber.subscribedAt = Date.now();
        await existingSubscriber.save();

        return res.json({
          success: true,
          message: "Welcome back! Your subscription has been reactivated.",
          data: existingSubscriber,
        });
      }
    }

    // Create new subscription
    const subscriber = await Newsletter.create({
      email: email.toLowerCase(),
    });

    // Send welcome email (best-effort)
    if (isEmailConfigured) {
      try {
        await sendEmail(
          subscriber.email,
          "Welcome to IndiFarm Newsletter",
          `<div style="font-family:Arial,sans-serif;line-height:1.5">
             <h2>Welcome to IndiFarm!</h2>
             <p>Thanks for subscribing. You'll receive updates about fresh products and local farms.</p>
           </div>`
        );
      } catch (e) {
        console.error("Welcome email failed:", e?.message || e);
      }
    }

    res.status(201).json({
      success: true,
      message: "Successfully subscribed to newsletter!",
      data: subscriber,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Unsubscribe from newsletter
// @route   POST /api/newsletter/unsubscribe
// @access  Public
exports.unsubscribe = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }

    const subscriber = await Newsletter.findOne({ email: email.toLowerCase() });

    if (!subscriber) {
      return res
        .status(404)
        .json({ success: false, message: "Email not found in subscribers list" });
    }

    if (!subscriber.isActive) {
      return res
        .status(400)
        .json({ success: false, message: "Email is already unsubscribed" });
    }

    subscriber.isActive = false;
    await subscriber.save();

    res.json({
      success: true,
      message: "Successfully unsubscribed from newsletter",
      data: subscriber,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Get all subscribers (admin only)
// @route   GET /api/newsletter/subscribers
// @access  Private (Admin only)
exports.getAllSubscribers = async (req, res) => {
  try {
    const subscribers = await Newsletter.find({ isActive: true }).sort({
      subscribedAt: -1,
    });

    res.json({
      success: true,
      count: subscribers.length,
      data: subscribers,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Get subscriber count
// @route   GET /api/newsletter/count
// @access  Public
exports.getSubscriberCount = async (req, res) => {
  try {
    const count = await Newsletter.countDocuments({ isActive: true });

    res.json({
      success: true,
      count: count,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};
