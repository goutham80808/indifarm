const express = require("express");
const multer = require("multer");
const {
  createProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  getFarmerProducts,
} = require("../controllers/productController");
const { verifyToken, isFarmer } = require("../utils/authMiddleware");

const router = express.Router();

// Configure multer with in-memory storage; controller uploads to Cloudinary
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  },
});

// Public routes
router.get("/", getAllProducts);
router.get("/:id", getProduct);

// Farmer routes
router.post("/", verifyToken, isFarmer, upload.array('images', 5), createProduct);
router.put("/:id", verifyToken, isFarmer, upload.array('images', 5), updateProduct);
router.delete("/:id", verifyToken, isFarmer, deleteProduct);
router.get("/farmer/me", verifyToken, isFarmer, getFarmerProducts);

module.exports = router;
