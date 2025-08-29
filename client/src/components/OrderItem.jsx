import { useState } from "react";
import { Link } from "react-router-dom";
import { FaEye, FaStar } from "react-icons/fa";
import RatingModal from "./RatingModal";
import StarRating from "./StarRating";

const OrderItem = ({ order, to, showRatingButton = true }) => {
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);

  // Function to get status badge color
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "pending":
        return "badge-blue";
      case "accepted":
        return "badge-green";
      case "rejected":
        return "badge-red";
      case "completed":
        return "badge-green";
      case "cancelled":
        return "badge-red";
      default:
        return "badge-blue";
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const userRole = localStorage.getItem("userRole");
  const canRate = userRole === "consumer" && order.status === "completed" && !order.rated && showRatingButton;
  const hasRating = order.rating;

  return (
    <>
    <div className="card p-4 mb-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div className="mb-2 md:mb-0">
          <div className="flex items-center space-x-2">
            <span className="text-gray-500 text-sm">Order ID:</span>
            <span className="font-medium">{order._id.substring(0, 8)}...</span>
          </div>
          <div className="flex items-center space-x-2 mt-1">
            <span className="text-gray-500 text-sm">Date:</span>
            <span>{formatDate(order.createdAt)}</span>
          </div>
        </div>

        <div className="mb-2 md:mb-0">
          <div className="flex items-center space-x-2">
            <span className="text-gray-500 text-sm">Items:</span>
            <span>{order.items.length}</span>
          </div>
          <div className="flex items-center space-x-2 mt-1">
            <span className="text-gray-500 text-sm">Total:</span>
            <span className="font-bold text-green-600">
              ₨{order.totalAmount.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="mb-2 md:mb-0">
          <div className="flex items-center space-x-2">
            <span className="text-gray-500 text-sm">Status:</span>
            <span className={`badge ${getStatusBadgeClass(order.status)}`}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          </div>
          <div className="flex items-center space-x-2 mt-1">
              <span className="text-gray-500 text-sm">Farmer:</span>
              <span>{order.farmer.name}</span>
            </div>
            {order.farmer.averageRating > 0 && (
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-gray-500 text-sm">Rating:</span>
                <StarRating rating={order.farmer.averageRating} size="text-xs" />
                <span className="text-xs text-gray-500">
                  ({order.farmer.totalRatings})
                </span>
              </div>
            )}
        </div>

          <div className="flex flex-col space-y-2 mt-2 md:mt-0">
        <Link
          to={to || `/orders/${order._id}`}
              className="btn btn-outline flex items-center justify-center space-x-2"
        >
          <FaEye />
          <span>View Details</span>
        </Link>
            
            {canRate && (
              <button
                onClick={() => setIsRatingModalOpen(true)}
                className="btn btn-primary flex items-center justify-center space-x-2"
              >
                <FaStar />
                <span>Rate Farmer</span>
              </button>
            )}
            
            {hasRating && (
              <div className="flex items-center space-x-2 text-sm">
                <span className="text-gray-500">Your Rating:</span>
                <StarRating rating={hasRating.rating} size="text-xs" />
              </div>
            )}
          </div>
        </div>
      </div>

      <RatingModal
        isOpen={isRatingModalOpen}
        onClose={() => setIsRatingModalOpen(false)}
        order={order}
        existingRating={hasRating}
      />
    </>
  );
};

export default OrderItem;
