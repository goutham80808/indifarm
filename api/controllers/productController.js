const Product = require("../models/ProductModel");
const User = require("../models/UserModel");

const { cloudinary, isCloudinaryConfigured } = require("../utils/cloudinary");
const { isEmailConfigured, sendBulk } = require("../utils/emailService");
const Newsletter = require("../models/NewsletterModel");
const streamifier = require("streamifier");
const fs = require("fs");
const path = require("path");

function ensureUploadsDirExists() {
  const uploadsDir = path.join(__dirname, "..", "uploads");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  return uploadsDir;
}

function saveBufferToUploads(buffer, originalName) {
  const uploadsDir = ensureUploadsDirExists();
  const timestamp = Date.now();
  const safeName = originalName ? originalName.replace(/[^a-zA-Z0-9_.-]/g, "_") : "image";
  const filename = `${timestamp}-${safeName}`;
  const filePath = path.join(uploadsDir, filename);
  fs.writeFileSync(filePath, buffer);
  return `/uploads/${filename}`;
}

// @desc    Create a product
// @route   POST /api/products
// @access  Private (Farmer only)
exports.createProduct = async (req, res) => {
  try {
    req.body.farmer = req.user._id;
    console.log('[createProduct] files:', req.files?.length || 0, 'cloudinaryConfigured:', isCloudinaryConfigured);
    
    // Handle uploaded images (memory storage -> upload to Cloudinary)
    if (req.files && req.files.length > 0 && isCloudinaryConfigured) {
      const uploadToCloudinary = (buffer) =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: "indifarm/products",
              transformation: [{ quality: "auto", fetch_format: "auto" }],
            },
            (error, result) => {
              if (error) return reject(error);
              resolve(result.secure_url);
            }
          );
          streamifier.createReadStream(buffer).pipe(stream);
        });

      try {
        const uploadUrls = await Promise.all(
          req.files.map((file) => uploadToCloudinary(file.buffer))
        );
        req.body.images = uploadUrls;
        console.log('[createProduct] uploaded to Cloudinary:', req.body.images);
      } catch (uploadError) {
        console.error('[createProduct] Cloudinary upload failed:', uploadError?.message || uploadError);
        return res.status(500).json({
          success: false,
          message: "Image upload failed",
          error: uploadError.message,
        });
      }
    } else if (req.files && req.files.length > 0 && !isCloudinaryConfigured) {
      // Fallback: save locally if Cloudinary isn't configured
      try {
        req.body.images = req.files.map((file) => saveBufferToUploads(file.buffer, file.originalname));
        console.log('[createProduct] saved locally:', req.body.images);
      } catch (localErr) {
        return res.status(500).json({ success: false, message: "Local image save failed", error: localErr.message });
      }
    }

    const product = await Product.create(req.body);

    // Optional broadcast to subscribers when enabled
    if (process.env.FEATURE_EMAIL_NEW_PRODUCT === "true" && isEmailConfigured) {
      try {
        const recipients = (await Newsletter.find({ isActive: true }).select("email -_id")).map(r => r.email);
        if (recipients.length > 0) {
          const productUrl = `${process.env.CLIENT_BASE_URL || "http://localhost:5173"}/products/${product._id}`;
          await sendBulk(
            recipients,
            `New product: ${product.name}`,
            `<div style="font-family:Arial,sans-serif;line-height:1.5">
               <h2>${product.name}</h2>
               <p>${product.description || ""}</p>
               <p>Price: ₨${Number(product.price).toFixed(2)} / ${product.unit}</p>
               <p><a href="${productUrl}">View product</a></p>
             </div>`
          );
        }
      } catch (e) {
        console.error("Broadcast email failed:", e?.message || e);
      }
    }

    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getAllProducts = async (req, res) => {
  try {
    const query = {};

    // Search filter by name
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, "i");
      query.$or = [{ name: searchRegex }];
    }

    if (req.query.category) {
      query.category = req.query.category;
    }

    if (req.query.farmer) {
      query.farmer = req.query.farmer;
    }

    query.isActive = true;

    const products = await Product.find(query)
      .populate("farmer", "name averageRating totalRatings")
      .populate("category", "name");

    res.json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("farmer", "name averageRating totalRatings")
      .populate("category", "name");

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (Farmer only)
exports.updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    if (
      product.farmer.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this product",
      });
    }

    // Handle uploaded images (memory storage -> upload to Cloudinary)
    if (req.files && req.files.length > 0 && isCloudinaryConfigured) {
      const uploadToCloudinary = (buffer) =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: "indifarm/products",
              transformation: [{ quality: "auto", fetch_format: "auto" }],
            },
            (error, result) => {
              if (error) return reject(error);
              resolve(result.secure_url);
            }
          );
          streamifier.createReadStream(buffer).pipe(stream);
        });

      try {
        const uploadUrls = await Promise.all(
          req.files.map((file) => uploadToCloudinary(file.buffer))
        );
        req.body.images = uploadUrls;
      } catch (uploadError) {
        return res.status(500).json({
          success: false,
          message: "Image upload failed",
          error: uploadError.message,
        });
      }
    } else if (req.files && req.files.length > 0 && !isCloudinaryConfigured) {
      // Fallback: save locally if Cloudinary isn't configured
      try {
        req.body.images = req.files.map((file) => saveBufferToUploads(file.buffer, file.originalname));
      } catch (localErr) {
        return res.status(500).json({ success: false, message: "Local image save failed", error: localErr.message });
      }
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (Farmer only)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    // Make sure user is the product owner
    if (
      product.farmer.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this product",
      });
    }

    await product.remove();

    res.json({
      success: true,
      message: "Product removed",
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Get farmer products
// @route   GET /api/products/farmer
// @access  Private (Farmer only)
exports.getFarmerProducts = async (req, res) => {
  try {
    const products = await Product.find({ farmer: req.user._id }).populate(
      "category",
      "name"
    );

    res.json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};
