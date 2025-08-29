import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createRating, updateRating, clearError } from "../redux/slices/ratingSlice";
import { FaStar, FaTimes } from "react-icons/fa";

const RatingModal = ({ isOpen, onClose, order, existingRating = null }) => {
  const [rating, setRating] = useState(existingRating?.rating || 0);
  const [review, setReview] = useState(existingRating?.review || "");
  const [isAnonymous, setIsAnonymous] = useState(existingRating?.isAnonymous || false);
  const [hoveredStar, setHoveredStar] = useState(0);

  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.ratings);

  useEffect(() => {
    if (existingRating) {
      setRating(existingRating.rating);
      setReview(existingRating.review);
      setIsAnonymous(existingRating.isAnonymous);
    }
  }, [existingRating]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      return;
    }

    const ratingData = {
      rating,
      review,
      isAnonymous,
    };

    if (existingRating) {
      // Update existing rating
      await dispatch(updateRating({ 
        ratingId: existingRating._id, 
        ratingData 
      }));
    } else {
      // Create new rating
      await dispatch(createRating({
        orderId: order._id,
        ...ratingData,
      }));
    }

    onClose();
  };

  const handleClose = () => {
    dispatch(clearError());
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            {existingRating ? "Edit Rating" : "Rate Your Experience"}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating
            </label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(0)}
                  className="text-2xl focus:outline-none"
                >
                  <FaStar
                    className={`${
                      star <= (hoveredStar || rating)
                        ? "text-yellow-400"
                        : "text-gray-300"
                    } transition-colors duration-200`}
                  />
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {rating === 1 && "Poor"}
              {rating === 2 && "Fair"}
              {rating === 3 && "Good"}
              {rating === 4 && "Very Good"}
              {rating === 5 && "Excellent"}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Review (Optional)
            </label>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Share your experience with this farmer..."
              maxLength={500}
            />
            <p className="text-xs text-gray-500 mt-1">
              {review.length}/500 characters
            </p>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="anonymous"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
            <label htmlFor="anonymous" className="ml-2 text-sm text-gray-700">
              Submit anonymously
            </label>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || rating === 0}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Submitting..." : existingRating ? "Update Rating" : "Submit Rating"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RatingModal;
