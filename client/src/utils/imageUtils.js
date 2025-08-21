/**
 * Utility functions for handling images and filtering out invalid blob URLs
 */

// Derive backend origin for constructing full image URLs (no hardcoded localhost)
const API_BASE = import.meta?.env?.VITE_API_URL || "/api";
function getBackendOrigin() {
  try {
    if (typeof API_BASE === "string" && (API_BASE.startsWith("http://") || API_BASE.startsWith("https://"))) {
      return new URL(API_BASE).origin; // e.g., https://api.indifarm.com
    }
  } catch (_) {}
  // Fallback to current site origin (useful when proxying /api in dev)
  return window.location.origin;
}
const BACKEND_ORIGIN = getBackendOrigin();

/**
 * Checks if an image URL is valid (not a blob URL and is a string)
 * @param {string} imageUrl - The image URL to validate
 * @returns {boolean} - True if the image URL is valid
 */
export const isValidImageUrl = (imageUrl) => {
  if (!imageUrl || typeof imageUrl !== 'string') return false;
  if (imageUrl.startsWith('blob:')) return false;
  return true;
};

/**
 * Converts a relative image path to a full URL
 * @param {string} imagePath - The relative image path (e.g., /uploads/filename.jpg)
 * @returns {string} - Full image URL
 */
export const getFullImageUrl = (imagePath) => {
  if (!imagePath || typeof imagePath !== 'string') return null;
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // If it's a relative path to backend uploads, construct full URL
  if (imagePath.startsWith('/uploads')) {
    return `${BACKEND_ORIGIN}${imagePath}`;
  }
  
  // If it's just a filename, construct full URL
  return `${BACKEND_URL}/uploads/${imagePath}`;
};

/**
 * Gets the first valid image from an array of images
 * @param {Array} images - Array of image URLs
 * @param {string} placeholder - Placeholder image URL to use if no valid images
 * @returns {string} - Valid image URL or placeholder
 */
export const getValidImage = (images, placeholder = null) => {
  if (!images || !Array.isArray(images) || images.length === 0) {
    return placeholder;
  }
  
  const firstImage = images[0];
  if (isValidImageUrl(firstImage)) {
    return getFullImageUrl(firstImage);
  }
  
  return placeholder;
};

/**
 * Filters an array of images to only include valid image URLs
 * @param {Array} images - Array of image URLs to filter
 * @returns {Array} - Array containing only valid image URLs
 */
export const filterValidImages = (images) => {
  if (!images || !Array.isArray(images)) return [];
  
  return images
    .filter(image => isValidImageUrl(image))
    .map(image => getFullImageUrl(image))
    .filter(url => url !== null);
};

/**
 * Gets a valid image for display, with fallback to placeholder
 * @param {Array} images - Array of image URLs
 * @param {number} index - Index of the image to get (default: 0)
 * @param {string} placeholder - Placeholder image URL to use if no valid images
 * @returns {string} - Valid image URL or placeholder
 */
export const getValidImageByIndex = (images, index = 0, placeholder = null) => {
  const validImages = filterValidImages(images);
  
  if (validImages.length === 0 || index >= validImages.length) {
    return placeholder;
  }
  
  return validImages[index];
};
